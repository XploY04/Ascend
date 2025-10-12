"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, Github } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { name: "Overview", slug: "overview" },
  { name: "Skills", slug: "skills" },
  { name: "Contact", slug: "contact" },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const profileImage = session?.user?.image || "/default-profile.jpg"; // Fallback to a default profile image if none is available

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-gray-700 backdrop-blur-md text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Github className="h-8 w-8" />
              <span className="hidden text-xl font-semibold sm:inline-block">
                Lakshya
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => onTabChange(item.slug)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === item.slug
                    ? "bg-gradient-to-br from-slate-700/10 via-blue-500/20 to-slate-700/10 text-white"
                    : "text-gray-300 hover:bg-gradient-to-tr from-slate-700/10 via-blue-500/20 to-slate-700/10 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Image
                src={profileImage}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-gray-700 hover:ring-gray-500"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 rounded-md hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-2"
          >
            {navItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  onTabChange(item.slug);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeTab === item.slug
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
