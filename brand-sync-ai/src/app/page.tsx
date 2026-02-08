"use client";

import BrandAnalyzer from "@/components/onboarding/brand-analyzer";
import { BrandProfile } from "@/types/brand";
import { useState } from "react";

export default function Home() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              BrandSync AI
            </span>
          </div>
        </header>

        {!profile ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <BrandAnalyzer onComplete={setProfile} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Welcome, {profile.name}</h1>
              <p className="text-xl text-gray-400">Your Brand DNA is locked in. Let&apos;s create content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">Draft a New Post</h3>
                <p className="text-gray-400 text-sm">Create a LinkedIn or Instagram post from scratch using your brand voice.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Campaign Planner</h3>
                <p className="text-gray-400 text-sm">Plan a week of content based on upcoming events.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

