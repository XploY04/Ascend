# 🚀 Lakshya - AI-Powered Learning Roadmap Platform

<div align="center">
  
  ![Lakshya Banner](https://img.shields.io/badge/Lakshya-AI_Roadmap_Builder-181717?style=for-the-badge&logo=github)
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

  **Create personalized, AI-powered learning roadmaps to master any skill or technology**

  [View Demo](#-demo) · [Report Bug](https://github.com/XploY04/Ascend/issues) · [Request Feature](https://github.com/XploY04/Ascend/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About the Project

**Lakshya** (meaning "Goal" or "Target" in Hindi) is an innovative AI-powered platform that helps developers and learners create personalized learning roadmaps. Whether you're aiming to master a new technology, prepare for a specific company interview, or advance your career, Lakshya generates comprehensive, structured learning paths tailored to your goals.

### Why Lakshya?

- 🤖 **AI-Powered Generation**: Leverage Google's Gemini 2.0 Flash model to create intelligent, contextual roadmaps
- 🎨 **GitHub-Inspired UI**: Familiar, clean interface that developers love
- 📊 **Progress Tracking**: Monitor your learning journey with interactive completion tracking
- 💾 **Persistent Storage**: Save and revisit your roadmaps anytime with MongoDB integration
- 🔄 **Version Control**: Track different versions of your roadmaps as you refine them
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Easy on the eyes with a beautiful dark theme
- 📄 **PDF Export**: Download your roadmaps as professional PDF documents

---

## ✨ Key Features

### 🧠 AI Chatbot Interface
- Interactive conversation-based roadmap generation
- Context-aware responses using Gemini 2.0 Flash
- Ability to refine and iterate on generated roadmaps
- Natural language understanding for goals and requirements

### 🗺️ Structured Roadmaps
- Organized into phases with clear timelines (Day 1-7, Week 1-2, etc.)
- Topic-based sections with detailed descriptions
- Curated resources and learning materials for each section
- Focus areas highlighting key concepts

### 📈 Progress Management
- Mark sections as completed
- Visual progress indicators
- Contribution-style activity graph
- Activity feed showing your learning milestones

### 👥 User Profiles
- GitHub OAuth authentication
- Personalized dashboard with your roadmaps
- Profile customization with bio and location
- Social features (followers, following)

### 🎨 Rich Markdown Support
- Full GitHub Flavored Markdown rendering
- Emoji support
- Code syntax highlighting
- Tables, lists, and formatting

### 📚 Repository-Style Organization
- Browse your roadmaps like GitHub repositories
- Search and filter capabilities
- Sort by last updated, popularity, etc.
- Star and fork functionality concept

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.1.4](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first styling
- **[Material-UI 6.3](https://mui.com/)** - Component library
- **[Framer Motion 11](https://www.framer.com/motion/)** - Animations
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless functions
- **[NextAuth.js 4](https://next-auth.js.org/)** - Authentication
- **[MongoDB](https://www.mongodb.com/)** - Database
- **[Mongoose 8](https://mongoosejs.com/)** - ODM for MongoDB

### AI & Generation
- **[Google Generative AI (Gemini 2.0)](https://ai.google.dev/)** - AI model for roadmap generation
- **[Axios](https://axios-http.com/)** - HTTP client

### Document Generation
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** - Tables in PDFs

### Markdown Processing
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** - GitHub Flavored Markdown
- **[remark-emoji](https://github.com/rhysd/remark-emoji)** - Emoji support
- **[rehype-raw](https://github.com/rehypejs/rehype-raw)** - HTML in markdown
- **[rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)** - Sanitize HTML

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** - Package manager
- **MongoDB** - [Atlas](https://www.mongodb.com/cloud/atlas) (cloud) or local instance
- **GitHub Account** - For OAuth authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/XploY04/Ascend.git
   cd Ascend
   ```

2. **Install dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Using pnpm (recommended):
   ```bash
   pnpm install
   ```
   
   Using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section below)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_KEY=mongodb+srv://your-connection-string

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (Get from: https://github.com/settings/developers)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google Generative AI (Get from: https://makersuite.google.com/app/apikey)
AI_KA_KEY=your-google-gemini-api-key
```

#### How to Get API Keys:

1. **MongoDB**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get your connection string

2. **NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```

3. **GitHub OAuth**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and generate Client Secret

4. **Google Gemini API**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key for Gemini

---

## 💡 Usage

### Creating Your First Roadmap

1. **Sign In**
   - Click "Get Started" on the landing page
   - Authenticate with your GitHub account

2. **Navigate to Chatbot**
   - Click on the chatbot icon or "Try AI Chatbot" button
   - You'll be taken to the AI-powered chat interface

3. **Describe Your Goal**
   - Type your learning objective in natural language
   - Example: "I want to become a full-stack developer in 3 months"
   - Example: "Create a roadmap to learn machine learning for beginners"
   - Example: "Help me prepare for Google software engineer interview"

4. **Review Generated Roadmap**
   - The AI will generate a structured roadmap with:
     - Timeline-based sections
     - Topics to learn
     - Resources and links
     - Focus areas
   - Review the markdown-rendered output

5. **Refine (Optional)**
   - Ask follow-up questions to adjust the roadmap
   - Request more details on specific topics
   - Modify timelines or focus areas

6. **Save Your Roadmap**
   - Click the "Save" button
   - Provide a title and description
   - Your roadmap is now saved to your profile

7. **Track Progress**
   - Go to your dashboard
   - Open your saved roadmap
   - Mark sections as completed as you progress
   - View your progress percentage

8. **Export as PDF**
   - Open any roadmap
   - Click the "Download PDF" button
   - Get a professional PDF document

---

## 📁 Project Structure

```
Ascend/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── generate/             # AI roadmap generation
│   │   ├── markdownToJson/       # Roadmap data fetching
│   │   ├── edit/                 # Roadmap editing
│   │   ├── users/                # User management
│   │   └── activity/             # Activity tracking
│   ├── chatbot/                  # Chatbot interface
│   │   └── page.tsx              # Main chatbot page
│   ├── components/               # Reusable React components
│   │   ├── header.tsx            # Navigation header
│   │   ├── profile.tsx           # User profile sidebar
│   │   ├── ReadmeViewer.tsx      # Markdown renderer
│   │   ├── repositoryCard.tsx    # Roadmap card display
│   │   ├── contributionsGraph.tsx # Activity graph
│   │   ├── activityFeed.tsx      # Activity timeline
│   │   ├── EditDialog.tsx        # Roadmap editing modal
│   │   ├── SaveDialog.tsx        # Save roadmap modal
│   │   └── footer.tsx            # Footer component
│   ├── landing/                  # Landing page
│   │   └── page.tsx              # Public landing page
│   ├── roadmap/                  # Roadmap viewing
│   │   └── [id]/                 # Dynamic roadmap routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home/Dashboard page
│   └── providers.tsx             # Context providers
├── public/                       # Static assets
│   └── *.svg                     # SVG icons
├── utils/                        # Utility functions
│   ├── db.ts                     # MongoDB connection & schemas
│   └── pdfGenerator.ts           # PDF generation utility
├── .gitignore                    # Git ignore rules
├── .npmrc                        # npm configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### `GET /api/auth/signin`
- Sign in with GitHub OAuth

#### `GET /api/auth/signout`
- Sign out current user

#### `GET /api/auth/session`
- Get current user session

### Roadmap Endpoints

#### `PUT /api/generate`
Generate a new roadmap using AI

**Request Body:**
```json
{
  "prompt": "I want to learn React in 3 months"
}
```

**Response:**
```json
{
  "markdown": "# React Learning Roadmap\n\n...",
  "sections": [...]
}
```

#### `GET /api/markdownToJson`
Fetch all roadmaps for the authenticated user

**Response:**
```json
[
  {
    "_id": "...",
    "name": "react-roadmap",
    "title": "React Learning Path",
    "description": "3 month React journey",
    "sections": [...],
    "lastUpdated": "2024-01-01"
  }
]
```

#### `POST /api/edit`
Save or update a roadmap

**Request Body:**
```json
{
  "title": "My Roadmap",
  "description": "Description",
  "markdownContent": "# Content...",
  "sections": [...]
}
```

### User Endpoints

#### `GET /api/users/profile`
Get current user profile

#### `PUT /api/users/profile`
Update user profile

### Activity Endpoints

#### `GET /api/activity`
Get user activity feed

---

## 🔧 Development

### Running Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm run start
```

### Using Turbopack (Development)

The project is configured to use Turbopack for faster development:

```bash
npm run dev
# This runs: next dev --turbopack
```

---

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy Lakshya is using the [Vercel Platform](https://vercel.com):

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   - Add all variables from `.env.local` in Vercel dashboard
   - Update `NEXTAUTH_URL` to your production domain

### Deploy on Other Platforms

The project includes a `vercel.json` configuration but can be deployed to any platform supporting Next.js:

- **Netlify**: Use Next.js plugin
- **AWS Amplify**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **Railway**: One-click deployment
- **Render**: Deploy as web service

Make sure to:
- Set all environment variables
- Configure MongoDB connection for production
- Update OAuth callback URLs

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Internationalization
- ♿ Accessibility improvements
- 🧪 Testing coverage

---

## 📄 License

This project is currently not licensed. All rights reserved to the project maintainers.

If you wish to use, modify, or distribute this code, please contact the repository owner.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform
- **[Google AI](https://ai.google/)** - Gemini 2.0 Flash model for AI generation
- **[GitHub](https://github.com/)** - OAuth authentication and inspiration for UI
- **[MongoDB](https://www.mongodb.com/)** - Database solution
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[Material-UI](https://mui.com/)** - Component library
- **[Lucide](https://lucide.dev/)** - Beautiful icon set
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering

---

## 📞 Support

If you have any questions or need help:

- 🐛 [Open an Issue](https://github.com/XploY04/Ascend/issues)
- 💬 Start a [Discussion](https://github.com/XploY04/Ascend/discussions)
- ⭐ Star the project if you find it helpful!

---

<div align="center">

**Made with ❤️ by the Lakshya Team**

[⬆ Back to Top](#-lakshya---ai-powered-learning-roadmap-platform)

</div>
