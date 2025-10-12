import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Import parseMdToSections function - we'll reuse the function from markdownToJson API
// This is a duplicate for now, but you might want to move this to a shared utility file
function parseMdToSections(markdownContent: string) {
  const sections = [];
  const dayRangeRegex = /#### \*\*Day (\d+)–(\d+): ([^\*]+)\*\*/g;
  let match;

  while ((match = dayRangeRegex.exec(markdownContent)) !== null) {
    const dayStart = match[1];
    const dayEnd = match[2];
    const focusArea = match[3].trim();
    const dayRange = `Day ${dayStart}–${dayEnd}`;

    // Find the content for this section until the next section or end
    const sectionStartIndex = match.index;
    const nextSectionMatch = dayRangeRegex.exec(markdownContent);
    const sectionEndIndex = nextSectionMatch
      ? nextSectionMatch.index
      : markdownContent.length;
    dayRangeRegex.lastIndex = match.index + 1; // Reset regex to continue from the current match

    const sectionContent = markdownContent
      .substring(sectionStartIndex, sectionEndIndex)
      .trim();

    // Extract topics and resources
    const topicsRegex = /\*\*([^\*]+)\*\*/g;
    const resourcesRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const topics = [];
    const resources = [];

    let topicMatch;
    while ((topicMatch = topicsRegex.exec(sectionContent)) !== null) {
      topics.push(topicMatch[1].trim());
    }

    let resourceMatch;
    while ((resourceMatch = resourcesRegex.exec(sectionContent)) !== null) {
      resources.push({
        title: resourceMatch[1],
        url: resourceMatch[2],
      });
    }

    sections.push({
      title: `${dayRange}: ${focusArea}`,
      content: sectionContent,
      dayRange,
      focusArea,
      topics,
      resources,
      completed: false,
    });
  }

  return sections;
}

async function generateTextGemini(prompt: string) {
  if (!process.env.AI_KA_KEY) {
    throw new Error("AI_KA_KEY environment variable is not set");
  }
  const genAI = new GoogleGenerativeAI(process.env.AI_KA_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

const prompt = `
You are an ai roadmap generator. Now i have a markdown table of roadmap defined daywise and the table also contains the topics and resources for each day. Now, the user wants to refine the roadmap (which is in the form of markdown table)

The table is: {table}

The prompt from user side is: {prompt}

PLEASE REPLY WITH MARKDOWN TABLE AND JUST THAT NOTHING ELSE
`;

export async function PUT(req: Request) {
  try {
    const { table, userPrompt, title, description } = await req.json();

    if (!table) {
      return NextResponse.json(
        { error: "Table content is required" },
        { status: 400 }
      );
    }

    const resp = await generateTextGemini(
      prompt.replace("{table}", table).replace("{prompt}", userPrompt)
    );

    // Parse the generated markdown into sections
    const sections = parseMdToSections(resp);

    return NextResponse.json({
      response: resp,
      sections: sections,
      title: title,
      description: description,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}
