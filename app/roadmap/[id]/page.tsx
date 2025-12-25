"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

import Header from "../../components/header";
import Footer from "../../components/footer";
import ReadmeViewer from "../../components/ReadmeViewer";

// Helper function to format content with proper HTML
const formatContent = (content: string): string => {
  return content
    .replace(/&lt;br\s*\/?&gt;/gi, "<br/>")
    .replace(/<br\s*\/?>/gi, "<br/>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*\*/g, "") // Remove any remaining ** markers
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    );
};

// Helper function to clean topic text
const cleanTopicText = (topic: string): string => {
  return topic
    .replace(/&lt;br\s*\/?&gt;/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\*\*/g, "")
    .replace(/-\s*\*\*Description\*\*:.*$/gi, "")
    .replace(/-\s*\*\*Resource\*\*:.*$/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

interface Resource {
  title: string;
  url: string;
}

interface RoadmapSection {
  title: string;
  content: string;
  dayRange: string;
  focusArea: string;
  topics: string[];
  resources: Resource[];
  completed: boolean;
}

interface Roadmap {
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  markdownContent: string;
  sections: RoadmapSection[];
  versions: {
    content: string;
    timestamp: string;
    prompt?: string;
  }[];
  language: string;
  languageColor: string;
}

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Unwrap params Promise using React.use()
  const unwrappedParams =
    params instanceof Promise ? React.use(params) : params;

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const { status } = useSession();
  const router = useRouter();
  const roadmapId = unwrappedParams?.id; // Access id from unwrapped params safely

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    // Skip fetch if we don't have a valid ID
    if (!roadmapId) {
      setLoading(false);
      return;
    }
    const fetchRoadmap = async () => {
      try {
        console.log("Fetching roadmap with ID:", roadmapId);
        // Fetch from the markdownToJson endpoint with the ID parameter
        const response = await axios.get(`/api/markdownToJson/${roadmapId}`);
        console.log("Roadmap fetched successfully:", response.data);
        setRoadmap(response.data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        // In case the fetch fails, use our backup API for demo purposes
        try {
          console.log("Trying backup API");
          const backupResponse = await axios.get(`/api/roadmap/${roadmapId}`);
          console.log("Backup API successful");
          setRoadmap(backupResponse.data);
        } catch (backupError) {
          console.error("Backup API also failed:", backupError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [status, router, roadmapId]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleSectionCompletion = async (index: number) => {
    if (!roadmap) return;

    const updatedRoadmap = { ...roadmap };
    updatedRoadmap.sections[index].completed =
      !updatedRoadmap.sections[index].completed;

    // Update locally first for immediate UI feedback
    setRoadmap(updatedRoadmap);

    // Then update via API
    try {
      console.log(
        `Updating section ${index} completion status to ${updatedRoadmap.sections[index].completed}`
      );
      await axios.patch(`/api/markdownToJson/${roadmap._id}`, {
        sectionIndex: index,
        completed: updatedRoadmap.sections[index].completed,
      });
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating section status:", error);
      // Revert the change if the API call fails
      updatedRoadmap.sections[index].completed =
        !updatedRoadmap.sections[index].completed;
      setRoadmap({ ...updatedRoadmap });
    }
  };

  const calculateProgress = (): number => {
    if (!roadmap || roadmap.sections.length === 0) return 0;

    const completedSections = roadmap.sections.filter(
      (section) => section.completed
    ).length;
    return Math.round((completedSections / roadmap.sections.length) * 100);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-400">Roadmap not found</div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab="skills" onTabChange={() => {}} />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {roadmap.title}
          </h1>
          <p className="text-slate-400 mb-4">{roadmap.description}</p>

          <div className="my-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Content Overview */}
        <div className="mb-8">
          <ReadmeViewer content={roadmap.markdownContent} />
        </div>

        {/* Roadmap Sections */}
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Sections</h2>
        <div className="space-y-4">
          {roadmap.sections.map((section, index) => (
            <div
              key={index}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionCompletion(index);
                    }}
                    className="flex items-center justify-center"
                  >
                    {section.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h3
                      className={`text-md font-medium ${
                        section.completed ? "text-slate-300" : "text-slate-100"
                      }`}
                    >
                      {section.title.replace(/\*\*/g, "")}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {section.dayRange.replace(/\*\*/g, "")} •{" "}
                      {section.focusArea.replace(/\*\*/g, "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-700/50 rounded-full px-2 py-1">
                    {section.topics.length} topics
                  </span>
                  {expandedSections[index] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {expandedSections[index] && (
                <div className="p-4 pt-0 border-t border-slate-700/50">
                  <div
                    className="text-sm text-slate-300 my-3 space-y-2"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(section.content),
                    }}
                  />

                  {/* Topics */}
                  <div className="my-4">
                    <h4 className="text-xs uppercase text-slate-400 mb-2">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {section.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs text-slate-300 bg-slate-700/70 rounded-full px-3 py-1"
                        >
                          {cleanTopicText(topic)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="mt-4">
                    <h4 className="text-xs uppercase text-slate-400 mb-2">
                      Resources
                    </h4>
                    <div className="space-y-2">
                      {section.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                        >
                          <BookOpen className="w-4 h-4" />
                          {resource.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
