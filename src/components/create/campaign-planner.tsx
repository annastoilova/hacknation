"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Linkedin, Instagram, Sparkles, ChevronRight, Target } from 'lucide-react';
import { CampaignIntent, BrandProfile } from '@/src/types/brand';
import clsx from 'clsx';

export default function CampaignPlanner({ brandProfile, onGenerate }: { brandProfile: BrandProfile, onGenerate: (intent: CampaignIntent) => void }) {
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
                <p className="text-gray-400">Describe your post intent.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" /> What&apos;s the core message?
                    </label>
                    <textarea
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => togglePlatform('linkedin')} className={clsx("p-4 rounded-xl border flex gap-2 justify-center transition-all", platforms.includes('linkedin') ? "border-blue-600 text-blue-400 bg-blue-600/10" : "border-zinc-800 hover:border-zinc-700")}>
                        <Linkedin className="w-5 h-5" /> LinkedIn
                    </button>
                    <button onClick={() => togglePlatform('instagram')} className={clsx("p-4 rounded-xl border flex gap-2 justify-center transition-all", platforms.includes('instagram') ? "border-pink-600 text-pink-400 bg-pink-600/10" : "border-zinc-800 hover:border-zinc-700")}>
                        <Instagram className="w-5 h-5" /> Instagram
                    </button>
                </div>

                {/* Tone Modifiers */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" /> Tone Direction
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {[brandProfile.voice.tone, "Energetic", "Professional", "Witty"].map(t => (
                            <button
                                key={t}
                                onClick={() => setToneModifier(t)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                    (toneModifier === t || (!toneModifier && t === brandProfile.voice.tone))
                                        ? "bg-purple-600/10 border-purple-600 text-purple-400"
                                        : "bg-black border-zinc-800 text-gray-500 hover:border-zinc-700"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleGenerate} disabled={!topic} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-gray-100">
                    <Sparkles className="w-5 h-5" /> Generate Post Variations <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
