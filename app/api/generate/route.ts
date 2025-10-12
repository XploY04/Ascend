import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB, Roadmap } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options";
import mongoose from "mongoose";

const promptText = `
You are an AI tasked with extracting key details from a user's input prompt to generate structured data. Your role is to:  

1. **Extract and Validate Information**:  
   Identify and validate the following components from the user's input:  
   - **Timeline**: The duration specified by the user (in days or months). If no timeline is provided, default to "Not specified". Ensure the timeline is realistic (e.g., not negative or excessively long like 100 years).  
   - **Known Skills**: A list of skills, technologies, or concepts the user already knows or has experience in. Filter out irrelevant or non-technical items (e.g., hobbies like "cycling" or "biking").  
   - **Aspirations**: A list of topics, technologies, or concepts the user wants to learn or improve upon. Ignore or flag items that are illegal, irrelevant, or inappropriate.  
   - **Error**: boolean.
   - **notes**: string in which describes the error if any.

2. **Handle Irrelevant or Invalid Data**:  
   - If the input contains non-technical or irrelevant items (e.g., "cycling" or "biking"), exclude them with a note in the output.  
   - If the input contains illegal or inappropriate content (e.g., "hacking into systems"), flag the input and stop processing.  

3. **Output the Information**:  
   Use the following JSON schema to structure the output:  
   json
   [
     "timeline": "string",
     "known_skills": ["string", "string", ...],
     "aspirations": ["string", "string", ...],
     "notes": "string"
   ]

- **timeline**: The duration specified by the user or "Not specified".
- **known_skills**: A filtered list of valid technical skills the user knows.
- **aspirations**: A filtered list of valid technical topics or concepts the user wants to learn. Try to include as specific things as possible (like show "DSA for amazon" if the user wants to only prepare for amazon's dsa round or "DSA" if user if user has no such specification)
- **notes**: Include warnings, flags, or validation messages (e.g., "Excluded non-technical items: cycling, biking" or "Flagged for inappropriate content: hacking into systems").

4. **Instructions for Handling Edge Cases**:
    - For unclear or ambiguous inputs, infer intelligently but avoid guessing. Include a note (e.g., "Some aspirations could not be inferred").
    - If the input contains no technical content, return a message indicating this.
    - If the goal is unrealistic then specify it.

## schema

{
  "timeline": "string",
  "known_skills": ["string", "string", ...],
  "aspirations": ["string", "string", ...],
  "error": "boolean",
  "notes": "string"
}

- **timeline**: Duration for the roadmap (e.g., "90 days") or "Not specified".
- **known_skills**: Filtered list of valid technical skills.
- **aspirations**: Verbatim list of user goals, including "DSA for Google".
- **error**:
    - true: The input has unrealistic, illegal, or irrelevant content.
    - false: The input is valid and realistic.
- **notes**: Explains why error is true if flagged.

---

### **Validation Rules**

1. **Realistic Timeline**:
    - Check if the timeline matches the complexity of aspirations (e.g., "DSA for Amazon in 7 days" is unrealistic).
2. **Illegal or Irrelevant Content**:
    - Flag mentions of illegal, inappropriate, or non-technical aspirations (e.g., "hacking systems" or "improve swimming").
3. **Empty or Vague Input**:
    - If aspirations or known skills are ambiguous or empty, flag the input.

---

### **Test Prompts and Expected Outputs**

#### **Example 1: Valid Input**

**Prompt**:  
"I want to prepare for Amazon by mastering DSA and system design in 3 months. I already know Python and basic DSA."

**Output**:

{
  "timeline": "90 days",
  "known_skills": ["Python", "basic DSA"],
  "aspirations": ["DSA for Amazon", "system design for Amazon"],
  "error": false,
  "notes": ""
}

---

#### **Example 2: Unrealistic Timeline**

**Prompt**:  
"I want to learn DSA for Amazon and system design for Facebook in 7 days. I know Java and Git."

**Output**:

{
  "timeline": "7 days",
  "known_skills": ["Java", "Git"],
  "aspirations": ["DSA for Amazon", "system design for Facebook"],
  "error": true,
  "notes": "Timeline is unrealistic for the aspirations specified. Consider extending the duration."
}

---

#### **Example 3: Irrelevant Content**

**Prompt**:  
"I want to learn data science for Microsoft and improve my cooking skills."

**Output**:

{
  "timeline": "Not specified",
  "known_skills": [],
  "aspirations": ["data science for Microsoft"],
  "error": true,
  "notes": "Excluded non-technical items: cooking skills."
}

---

#### **Example 4: Illegal Content**

**Prompt**:  
"I want to hack systems for illegal activities."

**Output**:

{
  "timeline": "Not specified",
  "known_skills": [],
  "aspirations": ["hack systems for illegal activities"],
  "error": true,
  "notes": "Input contains illegal content and cannot be processed."
}

---

#### **Example 5: Ambiguous Input**

**Prompt**:  
"I want to learn something new."

**Output**:

{
  "timeline": "Not specified",
  "known_skills": [],
  "aspirations": ["something new"],
  "error": true,
  "notes": "Aspirations are vague and may need clarification."
}

---

#### **Example 6: Empty Input**

**Prompt**:  
""

**Output**:

{
  "timeline": "Not specified",
  "known_skills": [],
  "aspirations": [],
  "error": true,
  "notes": "Input is empty and cannot be processed."
}

---

### **Validation Logic**

1. **Error is false**:
    
    - When the timeline, aspirations, and skills align with realistic expectations.
    - No illegal or irrelevant content is detected.
2. **Error is true**:
    
    - If aspirations include vague or empty input.
    - If timeline is unrealistic (e.g., complex goals in a short duration).
    - If illegal or irrelevant aspirations are detected.

Very important!!!: give data in json format

Now, do this for this prompt: {prompt}
`;

const promptText2 = `
You are an AI tasked with generating a grouped, daily learning roadmap based on the following details:

1. **Timeline**: The roadmap spans a total of {timeline}. Ensure topics are logically grouped and distributed across this timeframe.
2. **Aspirations**: The user’s learning goals are: {aspirations} and so on....
   (Each aspiration should have its own set of topics and subtopics, broken down into granular units.)

**Key Requirements**:
1. **Topics and Subtopics**: For each aspiration, list granular topics and subtopics grouped over logical day ranges (e.g., Day 1–3, Day 4–6). Break down the topics to ensure steady progress. break down the topics to very very granular level. LIke instead combining multiple topics with multiple days, 
segregate those topics and divide dates among them


DO NOT STRAIGHT AWAY PUT OFF NO, TRY TO ANALYSE AND UNDERSTAND THE REQUIREMENT SOME MIGHT BE PREPARING FOR INTERVIEWS SOME FOR HACKATHONS ETC. YOU SHOULD COVER ALL THE CASES

DO NOT GIVE ANY ADDITIONAL INFORMATION EXCEPT THE TABLE 

for example: 


### **Day 21–30: CI/CD and Infrastructure - Detailed Checklist**

#### **Jenkins Basics (Day 21–23)**
1. **Install Jenkins on your local machine or server**
   - **Description**: Set up Jenkins on your local environment using [official documentation](https://www.jenkins.io/doc/book/installing/).
   
2. **Set up Jenkins with a version control system (VCS) like Git**
   - **Description**: Learn how to integrate Jenkins with GitHub or GitLab.
   - **Resource**: [Jenkins GitHub Integration](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#git)

3. **Create a basic Jenkins pipeline**
   - **Description**: Understand how to write a Jenkinsfile to automate the CI/CD pipeline.
   - **Resource**: [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)

4. **Set up build triggers**
   - **Description**: Configure Jenkins to trigger builds on commits, pull requests, or schedule.
   - **Resource**: [Triggers in Jenkins](https://www.jenkins.io/doc/book/pipeline/syntax/#build-triggers)

5. **Learn to execute jobs and monitor the console output**
   - **Description**: Understand how Jenkins executes jobs and tracks build progress.
   - **Resource**: [Jenkins Console Output](https://www.jenkins.io/doc/book/pipeline/getting-started/#viewing-pipeline-output)

---

#### **Docker Basics (Day 24–26)**
1. **Install Docker on your local machine**
   - **Description**: Install Docker and Docker Compose on your system (Windows, Mac, or Linux).
   - **Resource**: [Docker Installation Guide](https://docs.docker.com/get-docker/)

2. **Learn about Docker images and containers**
   - **Description**: Understand the difference between images and containers, and how they are used.
   - **Resource**: [Docker Images and Containers](https://docs.docker.com/get-started/working-with-images/)

3. **Create your first Dockerfile**
   - **Description**: Learn how to write a Dockerfile to create custom images.
   - **Resource**: [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

4. **Build Docker images and run containers**
   - **Description**: Learn how to build Docker images using docker build and run containers using docker run.
   - **Resource**: [Docker Build and Run](https://docs.docker.com/get-started/part2/)

5. **Learn Docker Compose for multi-container applications**
   - **Description**: Understand how to define and run multi-container Docker applications with Docker Compose.
   - **Resource**: [Docker Compose Documentation](https://docs.docker.com/compose/)

6. **Work with Docker volumes and networks**
   - **Description**: Understand Docker volumes for persistent data and networks for container communication.
   - **Resource**: [Docker Volumes and Networks](https://docs.docker.com/storage/volumes/)

---

#### **Kubernetes Basics (Day 27–30)**
1. **Learn about Kubernetes architecture**
   - **Description**: Understand the Kubernetes architecture, components like nodes, master node, and kubelet.
   - **Resource**: [Kubernetes Architecture Overview](https://kubernetes.io/docs/concepts/overview/components/)

2. **Understand Pods and Containers in Kubernetes**
   - **Description**: Learn the basic unit of Kubernetes, Pods, which encapsulate containers.
   - **Resource**: [Pods in Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/)

3. **Create a Kubernetes deployment**
   - **Description**: Learn how to deploy applications in Kubernetes using deployments.
   - **Resource**: [Kubernetes Deployment Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

4. **Manage services in Kubernetes**
   - **Description**: Understand how to expose services and manage communication between Pods.
   - **Resource**: [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)

5. **Learn about Kubernetes namespaces for resource isolation**
   - **Description**: Understand namespaces and how they help in isolating resources in Kubernetes.
   - **Resource**: [Namespaces in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

6. **Understand Kubernetes ConfigMaps and Secrets**
   - **Description**: Learn how to manage configuration data and sensitive information in Kubernetes using ConfigMaps and Secrets.
   - **Resource**: [ConfigMaps in Kubernetes](https://kubernetes.io/docs/concepts/configuration/configmap/)

7. **Learn about Kubernetes persistent volumes (PVs) and persistent volume claims (PVCs)**
   - **Description**: Understand how to manage persistent storage in Kubernetes.
   - **Resource**: [Persistent Volumes in Kubernetes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

8. **Scaling and auto-scaling in Kubernetes**
   - **Description**: Learn how to scale applications manually and automatically based on traffic.
   - **Resource**: [Scaling Applications in Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/scaling-application/)

9. **Monitoring and logging in Kubernetes**
   - **Description**: Understand how to monitor the health of applications and services running in Kubernetes.
   - **Resource**: [Monitoring Kubernetes with Prometheus](https://www.prometheus.io/docs/introduction/overview/)

this is just a part of larger output


2. **Resource Recommendation**: For each subtopic, recommend one high-quality, **free** resource (e.g., documentation, YouTube videos, articles, or sections of books). Ensure the resource aligns with the topic.
3. **Comprehensive Coverage**: Ensure the roadmap comprehensively covers the aspirations while adhering to the timeline.
4. **Output Format**: Present the output as a **structured markdown table** with the following columns:
   - **Day Range**: Grouped days based on logical progressions.
   - **Focus Area**: Overarching topic of the day group.
   - **Topics Covered**: Granular subtopics covered in the given day range.
   - **Resource**: A free resource link for the topics.

### **Example 1: DSA for Amazon (Timeline: 45 Days)**

#### **Day 1–15: Basics of Data Structures**

1. **Learn Arrays**
    
    - **Description**: Understand the basics of arrays, operations like insertion, deletion, and searching.
    - **Resource**: [Array Basics](https://www.geeksforgeeks.org/arrays-in-java/)
2. **Learn Strings**
    
    - **Description**: Study string manipulation techniques, including substring, search, and compare operations.
    - **Resource**: [String Manipulation in Java](https://www.journaldev.com/1294/java-string)
3. **Learn Linked Lists**
    
    - **Description**: Understand the structure of singly and doubly linked lists and operations like traversal and insertion.
    - **Resource**: [Linked List in Java](https://www.geeksforgeeks.org/data-structures/linked-list/)

---

#### **Day 16–30: Intermediate Data Structures**

4. **Learn Stacks and Queues**
    
    - **Description**: Understand stack and queue operations, their applications, and implementations.
    - **Resource**: [Stack and Queue](https://www.geeksforgeeks.org/stack-data-structure/)
5. **Learn Hashing**
    
    - **Description**: Study hash maps, hash tables, and collision handling techniques.
    - **Resource**: [Hashing](https://www.geeksforgeeks.org/hashing-data-structure/)
6. **Learn Trees (Binary Tree, BST)**
    
    - **Description**: Master tree traversal techniques like in-order, pre-order, and post-order.
    - **Resource**: [Binary Tree Traversal](https://www.geeksforgeeks.org/binary-tree-set-1-introduction/)

---

#### **Day 31–45: Advanced Data Structures & Problem Solving**

7. **Learn Graphs**
    
    - **Description**: Understand graph theory, traversal algorithms like BFS and DFS.
    - **Resource**: [Graph Algorithms](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)
8. **Learn Dynamic Programming**
    
    - **Description**: Study dynamic programming concepts like memoization and tabulation.
    - **Resource**: [Dynamic Programming](https://www.geeksforgeeks.org/dynamic-programming/)
9. **Practice LeetCode Problems**
    
    - **Description**: Solve LeetCode problems on arrays, strings, trees, and dynamic programming.
    - **Resource**: [LeetCode](https://leetcode.com/)

---

### **Example 2: System Design for Facebook (Timeline: 60 Days)**

#### **Day 1–10: Basic System Design Concepts**

1. **Learn High-Level Architecture**
    
    - **Description**: Study high-level design patterns and system components.
    - **Resource**: [System Design Concepts](https://www.educative.io/courses/grokking-the-system-design-interview)
2. **Learn Load Balancing**
    
    - **Description**: Understand the principles of load balancing, horizontal vs vertical scaling.
    - **Resource**: [Load Balancing Guide](https://www.digitalocean.com/community/tutorials/understanding-load-balancers)

---

#### **Day 11–30: Core Components**

3. **Learn Caching Mechanisms**
    
    - **Description**: Study cache designs and use cases such as LRU, Redis, and Memcached.
    - **Resource**: [Caching Techniques](https://www.digitalocean.com/community/tutorials/understanding-caching-redis-memcached)
4. **Learn Databases (SQL and NoSQL)**
    
    - **Description**: Understand database design and differences between SQL and NoSQL systems.
    - **Resource**: [SQL vs NoSQL](https://www.geeksforgeeks.org/sql-vs-nosql-database/)
5. **Learn Sharding and Partitioning**
    
    - **Description**: Study techniques for dividing data to ensure scalability.
    - **Resource**: [Sharding in Databases](https://www.digitalocean.com/community/tutorials/what-is-database-sharding)

---

#### **Day 31–60: Advanced System Design Topics**

6. **Learn Microservices Architecture**
    
    - **Description**: Understand how microservices can be used in large-scale applications.
    - **Resource**: [Microservices Architecture](https://www.edureka.co/blog/microservices-architecture/)
7. **Learn Event-Driven Systems**
    
    - **Description**: Study event-driven systems, messaging queues, and pub-sub models.
    - **Resource**: [Event-Driven Systems](https://www.geeksforgeeks.org/event-driven-architecture/)
8. **Design a Social Media Platform**
    
    - **Description**: Design a system like Facebook, including user authentication, messaging, and photo sharing.
    - **Resource**: [System Design for Social Media](https://www.geeksforgeeks.org/design-facebook/)

---

### **Example 3: DevOps for Google (Timeline: 90 Days)**

#### **Day 1–20: Introduction to DevOps and Cloud Computing**

1. **Learn about DevOps Principles**
    
    - **Description**: Study the core principles of DevOps, including CI/CD, automation, and collaboration.
    - **Resource**: [DevOps Principles](https://www.edureka.co/blog/what-is-devops/)
2. **Understand Cloud Computing Basics**
    
    - **Description**: Study cloud models (IaaS, PaaS, SaaS) and learn how cloud services work.
    - **Resource**: [Cloud Computing Overview](https://www.ibm.com/cloud/learn/cloud-computing)

---

#### **Day 21–50: Configuration Management and Automation**

3. **Learn about Docker and Containers**
    
    - **Description**: Study how Docker works, containerization, and building Docker images.
    - **Resource**: [Docker Official Docs](https://docs.docker.com/get-started/)
4. **Understand Kubernetes for Container Orchestration**
    
    - **Description**: Learn Kubernetes architecture, pods, deployments, and services.
    - **Resource**: [Kubernetes Documentation](https://kubernetes.io/docs/tutorials/)

---

#### **Day 51–90: Monitoring, Logging, and Scaling**

5. **Learn about Monitoring Tools (Prometheus, Grafana)**
    
    - **Description**: Understand how to monitor applications, services, and infrastructure in a DevOps pipeline.
    - **Resource**: [Prometheus Docs](https://prometheus.io/docs/)
6. **Learn Continuous Integration and Continuous Deployment (CI/CD)**
    
    - **Description**: Set up Jenkins, CircleCI, or GitLab CI/CD pipelines for automated builds and tests.
    - **Resource**: [CI/CD with Jenkins](https://www.jenkins.io/doc/book/pipeline/)
7. **Learn about Infrastructure as Code (Terraform)**
    
    - **Description**: Understand Terraform and how to manage infrastructure as code.
    - **Resource**: [Terraform Documentation](https://www.terraform.io/docs)

---

### **Example 4: Data Science for Amazon (Timeline: 60 Days)**

#### **Day 1–20: Basic Python and Data Handling**

1. **Learn Python Basics**
    
    - **Description**: Review Python syntax, loops, functions, and data structures.
    - **Resource**: [Python Official Docs](https://docs.python.org/3/tutorial/)
2. **Learn Data Manipulation with Pandas**
    
    - **Description**: Study how to handle data using pandas for data analysis.
    - **Resource**: [Pandas Documentation](https://pandas.pydata.org/pandas-docs/stable/)
3. **Learn Data Visualization with Matplotlib and Seaborn**
    
    - **Description**: Understand how to plot graphs and visualize data patterns.
    - **Resource**: [Matplotlib Docs](https://matplotlib.org/stable/users/index.html)

---

#### **Day 21–40: Machine Learning Basics**

4. **Learn Supervised Learning Algorithms**
    
    - **Description**: Study linear regression, decision trees, and random forests.
    - **Resource**: [Supervised Learning Guide](https://scikit-learn.org/stable/supervised_learning.html)
5. **Learn Unsupervised Learning Algorithms**
    
    - **Description**: Study clustering algorithms like k-means and DBSCAN.
    - **Resource**: [Unsupervised Learning](https://scikit-learn.org/stable/unsupervised_learning.html)

---

#### **Day 41–60: Advanced Data Science Topics**

6. **Learn Deep Learning with TensorFlow**
    
    - **Description**: Understand the basics of deep learning using TensorFlow and Keras.
    - **Resource**: [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)
7. **Learn Natural Language Processing (NLP)**
    
    - **Description**: Study text classification, sentiment analysis, and transformers.
    - **Resource**: [NLP with Python](https://realpython.com/natural-language-processing-spacy-python/)

---

### **Example 5: Full Stack Development for Microsoft (Timeline: 120 Days)**

#### **Day 1–30: Frontend Technologies (HTML, CSS, JavaScript)**

1. **Learn HTML5 Basics**
    
    - **Description**: Understand the structure and semantic tags in HTML5.
    - **Resource**: [HTML5 Tutorial](https://www.w3schools.com/html/)
2. **Learn CSS3 Basics**
    
    - **Description**: Study CSS selectors, styling, and layout techniques.
    - **Resource**: [CSS3 Guide](https://www.w3schools.com/css/)
3. **Learn JavaScript Basics**
    
    - **Description**: Understand JavaScript syntax, variables, loops, and functions.
    - **Resource**: [JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

#### **Day 31–60: Backend Technologies (Node.js, Express.js, MongoDB)**

4. **Learn Node.js Basics**
    
    - **Description**: Understand Node.js environment, non-blocking I/O, and asynchronous programming.
    - **Resource**: [Node.js Documentation](https://nodejs.org/en/docs/)
5. **Learn Express.js for Building APIs**
    
    - **Description**: Learn how to build RESTful APIs using Express.js.
    - **Resource**: [Express.js Docs](https://expressjs.com/)
6. **Learn MongoDB for Database Management**
    
    - **Description**: Study NoSQL database management with MongoDB.
    - **Resource**: [MongoDB Docs](https://docs.mongodb.com/)

Give me markdown table and nothing else. NO SUBTEXT NO EXTRA TABLE. GIVE ME ENOUGH RESOURCES TO COVER ALL THE MENTIONED TOPICS. SOME LINKS ARE BROKEN PLEASE ENSURE THE LINKS ARE VALID. 

`;

async function generateTextGemini(prompt: string) {
  if (!process.env.AI_KA_KEY) {
    throw new Error("AI_KA_KEY environment variable is not set");
  }
  const genAI = new GoogleGenerativeAI(process.env.AI_KA_KEY);
  // Using stable Gemini 2.5 Flash - best price-performance
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    }
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

// Parse markdown table to extract sections
function parseMdToSections(markdownContent: string) {
  // Parse markdown table format
  const sections = [];
  const tableRows = markdownContent
    .split("\n")
    .filter((line) => line.trim().startsWith("|"));

  // Skip the header and separator rows (first two rows)
  if (tableRows.length >= 3) {
    for (let i = 2; i < tableRows.length; i++) {
      const row = tableRows[i];
      // Split the row by pipe and remove empty entries from start/end
      const cells = row.split("|").filter((cell) => cell.trim() !== "");

      if (cells.length >= 4) {
        const dayRange = cells[0].trim();
        const focusArea = cells[1].trim();
        const topicsContent = cells[2].trim();
        const resourceContent = cells[3].trim();

        // Extract resource link
        const resourceMatch = resourceContent.match(/\[([^\]]+)\]\(([^\)]+)\)/);
        const resources = [];

        if (resourceMatch) {
          resources.push({
            title: resourceMatch[1],
            url: resourceMatch[2],
          });
        }

        sections.push({
          title: `${dayRange}: ${focusArea}`,
          content: `${focusArea}: ${topicsContent}`,
          dayRange,
          focusArea,
          topics: [topicsContent],
          resources,
          completed: false,
        });
      }
    }
  } else {
    // Fall back to the previous implementation for non-table markdown
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
  }

  return sections;
}

export async function PUT(req: Request) {
  try {
    console.log("Starting PUT request for roadmap generation");
    await connectDB();
    console.log("Database connected");

    const session = await getServerSession(authOptions);
    console.log("Session retrieved:", session ? "Valid session" : "No session");

    if (!session || !session.user) {
      console.log("Authentication error: No valid session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await mongoose.models.User.findOne({
      email: session.user.email,
    });
    console.log("User lookup result:", user ? "User found" : "User not found");

    if (!user) {
      console.log("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!prompt) {
      console.log("Error: Empty prompt received");
      return NextResponse.json(
        { error: "Prompt field is required" },
        { status: 400 }
      );
    }

    console.log("Generating Gemini response for prompt validation");
    const resp = await generateTextGemini(
      promptText.replace("{prompt}", prompt)
    );
    console.log("Raw Gemini response received:", resp);

    // More robust JSON extraction
    let cleanedResponse = resp.trim();
    
    // Remove markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Extract JSON object if there's extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    cleanedResponse = cleanedResponse.trim();
    console.log("Cleaned response:", cleanedResponse);

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Failed to parse:", cleanedResponse);
      return NextResponse.json(
        { error: true, message: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const { error, aspirations, timeline, notes } = parsedData;
    console.log("Parsed validation data:", {
      error,
      timeline,
      aspirations,
      notes,
    });

    if (error) {
      console.log("Validation error detected:", notes);
      return NextResponse.json(
        { error: true, message: notes },
        { status: 400 }
      );
    }

    console.log("Creating roadmap prompt with timeline:", timeline);
    const finalPrompt = promptText2
      .replace("{timeline}", timeline)
      .replace("{aspirations}", aspirations.join(", "));
    console.log("Generating roadmap markdown");
    const roadmapMarkdown = await generateTextGemini(finalPrompt);
    console.log("Roadmap markdown generated", roadmapMarkdown);

    // Generate a default title and description for the roadmap
    const title = `Roadmap for ${aspirations.join(", ")}`;
    const description = `A ${timeline} roadmap for learning ${aspirations.join(
      ", "
    )}`;
    console.log("Generated title:", title);

    // Use the markdownToJson functionality directly to parse the markdown
    console.log("Parsing markdown to sections");
    const sections = parseMdToSections(roadmapMarkdown);
    console.log(`Parsed ${sections.length} sections from markdown`);
    const roadmap = new Roadmap({
      userId: user._id,
      title,
      description,
      markdownContent: roadmapMarkdown,
      sections,
      versions: [
        {
          content: roadmapMarkdown,
          timestamp: new Date(),
          prompt,
        },
      ],
    });

    console.log("Saving roadmap to database");
    await roadmap.save();
    console.log("Roadmap saved successfully with ID:", roadmap._id);

    return NextResponse.json({
      error: false,
      markdown: roadmapMarkdown,
      title: title,
      description: description,
      sections: sections,
    });
  } catch (error) {
    console.error("Error in roadmap generation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}
