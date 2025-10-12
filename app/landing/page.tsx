"use client";

import React from "react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  Brain,
  Target,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Github,
  BookOpen,
  BarChart3,
  Bot,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Generate personalized roadmaps using advanced AI technology tailored to your goals and current skills.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Paths",
    description:
      "Create targeted learning journeys for specific companies, technologies, or career objectives.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your learning progress with interactive sections and completion tracking.",
  },
  {
    icon: BookOpen,
    title: "Resource Integration",
    description:
      "Get curated resources and links for each learning topic, all in one place.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Share and discover roadmaps from the community, learn from others' experiences.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Generate comprehensive roadmaps in seconds with our intelligent chatbot interface.",
  },
];

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push("/");
    } else {
      signIn("github");
    }
  };
  return (
    <div className="min-h-screen bg-github-canvas-default text-github-fg-default overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-github-canvas-default/80 border-b border-github-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-github-accent-fg" />
              <span className="text-xl font-bold text-github-fg-default">
                Lakshya
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
              >
                How it Works
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/"
                  className="bg-github-accent-emphasis hover:bg-github-accent-fg px-4 py-2 rounded-lg font-medium transition-colors text-white"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="flex items-center space-x-2 bg-github-canvas-subtle hover:bg-github-border-default px-4 py-2 rounded-lg font-medium transition-colors border border-github-border-default"
                >
                  <Github className="h-4 w-4" />
                  <span>Sign in with GitHub</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-github-accent-subtle border border-github-accent-fg/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-github-accent-fg" />
                <span className="text-github-accent-fg text-sm font-medium">
                  AI-Powered Learning Platform
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
                Create Your Perfect
                <br />
                <span className="text-github-accent-fg">Learning Roadmap</span>
              </h1>

              <p className="text-xl text-github-fg-muted max-w-3xl mx-auto mb-8 leading-relaxed">
                Harness the power of AI to generate personalized learning paths.
                Whether you&apos;re preparing for interviews, switching careers,
                or mastering new technologies, Lakshya creates the perfect
                roadmap for your journey.
              </p>
            </motion.div>{" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={handleGetStarted}
                className="group bg-github-accent-emphasis hover:bg-github-accent-fg px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-white"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/chatbot"
                className="group border border-github-border-default hover:border-github-border-subtle px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 hover:bg-github-canvas-subtle"
              >
                <Bot className="h-5 w-5" />
                <span>Try AI Chatbot</span>
              </Link>
            </motion.div>{" "}
          </div>
        </div>
      </section>{" "}
      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-github-canvas-subtle"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to
              <span className="text-github-accent-fg"> Succeed</span>
            </h2>
            <p className="text-xl text-github-fg-muted max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to
              create the ultimate learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-github-canvas-default border border-github-border-default rounded-xl p-6 hover:border-github-accent-fg/50 transition-all duration-300 hover:shadow-lg hover:shadow-github-accent-fg/10"
              >
                <div className="bg-github-accent-subtle w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-github-accent-subtle transition-colors">
                  <feature.icon className="h-6 w-6 text-github-accent-fg" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="text-github-accent-fg">Works</span>
            </h2>
            <p className="text-xl text-github-fg-muted max-w-3xl mx-auto">
              Get started in minutes with our simple, three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us Your Goals",
                description:
                  "Share your learning objectives, current skills, and timeline with our AI chatbot.",
                icon: Target,
              },
              {
                step: "02",
                title: "AI Generates Your Path",
                description:
                  "Our intelligent system creates a personalized roadmap with resources and milestones.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Track Your Progress",
                description:
                  "Follow your roadmap, mark completed sections, and watch your skills grow.",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="bg-github-accent-emphasis w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <item.icon className="h-8 w-8 text-github-accent-fg mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {item.description}
                </p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-github-accent-subtle border border-github-accent-fg/30 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-github-fg-muted mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their careers with
              AI-powered roadmaps. Start building your future today.
            </p>
            <button
              onClick={handleGetStarted}
              className="group bg-github-accent-emphasis hover:bg-github-accent-fg px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl text-white"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>{" "}
      {/* Footer */}
      <footer className="border-t border-github-border-default py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Rocket className="h-8 w-8 text-github-accent-fg" />
              <span className="text-xl font-bold text-github-fg-default">
                Lakshya
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/support"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
              >
                Support
              </Link>
              <a
                href="https://github.com"
                className="text-github-fg-muted hover:text-github-fg-default transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-github-border-default text-center text-github-fg-muted">
            <p>
              &copy; 2024 Lakshya. All rights reserved. Built with ❤️ for
              learners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
