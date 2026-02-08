"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Linkedin, Instagram, Sparkles, Send, Target, ChevronRight } from 'lucide-react';
import { CampaignIntent, BrandProfile } from '@/types/brand';
import clsx from 'clsx';

interface CampaignPlannerProps {
    brandProfile: BrandProfile;
    onGenerate: (intent: CampaignIntent) => void;
}

export default function CampaignPlanner({ brandProfile, onGenerate }: CampaignPlannerProps) {
    const [topic, setTopic] = useState('');
    const [platforms, setPlatforms] = useState<('linkedin' | 'instagram')[]>(['linkedin']);
    const [toneModifier, setToneModifier] = useState('');

    const togglePlatform = (p: 'linkedin' | 'instagram') => {
        if (platforms.includes(p)) {
            if (platforms.length > 1) setPlatforms(platforms.filter(plat => plat !== p));
        } else {
            setPlatforms([...platforms, p]);
        }
    };

    const handleGenerate = () => {
        if (!topic) return;
        onGenerate({
            topic,
            platforms,
            toneModifier: toneModifier || brandProfile.voice.tone,
            goals: []
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-8"
        >
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Campaign Architect</h2>
                <p className="text-gray-400">Describe what you want to achieve, and BrandSync will plan the content.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
                {/* Topic Input */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" /> What&apos;s the core message?
                    </label>
                    <textarea
                        placeholder="e.g., Announce our new AI feature release with a focus on ease of use and speed."
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => togglePlatform('linkedin')}
                        className={clsx(
                            "flex items-center justify-center gap-3 p-4 rounded-xl border transition-all",
                            platforms.includes('linkedin')
                                ? "bg-blue-600/10 border-blue-600 text-blue-400"
                                : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                        )}
                    >
                        <Linkedin className="w-5 h-5" />
                        <span className="font-medium">LinkedIn</span>
                    </button>
                    <button
                        onClick={() => togglePlatform('instagram')}
                        className={clsx(
                            "flex items-center justify-center gap-3 p-4 rounded-xl border transition-all",
                            platforms.includes('instagram')
                                ? "bg-pink-600/10 border-pink-600 text-pink-400"
                                : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                        )}
                    >
                        <Instagram className="w-5 h-5" />
                        <span className="font-medium">Instagram</span>
                    </button>
                </div>

                {/* Tone Customization */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" /> Creative Direction / Tone
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[brandProfile.voice.tone, "More Energetic", "Very Professional", "Witty", "Direct"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setToneModifier(t)}
                                className={clsx(
                                    "px-3 py-2 rounded-lg text-xs font-medium border transition-all text-center",
                                    toneModifier === t || (!toneModifier && t === brandProfile.voice.tone)
                                        ? "bg-purple-600/10 border-purple-600 text-purple-400"
                                        : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={!topic}
                    className="group w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    Generate Post Variations
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" /> Brand Voice Syncing
                </div>
                <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" /> Visual Context Loaded
                </div>
            </div>
        </motion.div>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
