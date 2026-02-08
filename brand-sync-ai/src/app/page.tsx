"use client";

import BrandAnalyzer from "@/components/onboarding/brand-analyzer";
import CampaignPlanner from "@/components/create/campaign-planner";
import { BrandProfile, CampaignIntent } from "@/types/brand";
import { useState } from "react";

export default function Home() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [intent, setIntent] = useState<CampaignIntent | null>(null);
  const [view, setView] = useState<'onboarding' | 'planner' | 'generation'>('onboarding');

  const handleProfileComplete = (p: BrandProfile) => {
    setProfile(p);
    setView('planner');
  };

  const handleIntentComplete = (i: CampaignIntent) => {
    setIntent(i);
    setView('generation');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('onboarding')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Lume
            </span>
          </div>
          {profile && (
            <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-300">Brand DNA: <span className="text-white font-medium">{profile.name}</span></span>
            </div>
          )}
        </header>

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {view === 'onboarding' && <BrandAnalyzer onComplete={handleProfileComplete} />}

          {view === 'planner' && profile && (
            <CampaignPlanner brandProfile={profile} onGenerate={handleIntentComplete} />
          )}

          {view === 'generation' && intent && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Generation Engine Coming Soon...</h2>
              <p className="text-gray-400">Next step: Developing Phase 3 </p>
              <button
                onClick={() => setView('planner')}
                className="text-blue-400 hover:underline"
              >
                Back to Planner
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


