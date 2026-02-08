"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, ArrowRight, Check, Loader2 } from 'lucide-react';
import { analyzeBrand } from '@/src/lib/brand-analysis-agent';
import { BrandProfile } from '@/src/types/brand';
import clsx from 'clsx';

export default function BrandAnalyzer({ onComplete }: { onComplete: (profile: BrandProfile) => void }) {
    const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [profile, setProfile] = useState<BrandProfile | null>(null);

    const handleAnalyze = async () => {
        if (!url && !description) return;
        setStep('analyzing');
        try {
            const result = await analyzeBrand({ url, description });
            setProfile(result);
            setStep('result');
        } catch (error) {
            console.error(error);
            setStep('input');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                Setup Your Brand DNA
                            </h2>
                            <p className="text-gray-400">
                                Lume needs to understand your voice. Enter your website or a brief description.
                            </p>
                        </div>
                        <div className="space-y-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-400" /> Website URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://yourcompany.com"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-800"></div>
                                <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-800"></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" /> Brand Description
                                </label>
                                <textarea
                                    placeholder="Paste your bio, mission statement, or a few recent posts..."
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32 resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={!url && !description}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                Start Analysis <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
                {step === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
                    >
                        <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-white">Extracting Brand DNA...</h3>
                        </div>
                    </motion.div>
                )}
                {step === 'result' && profile && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Check className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Analysis Complete</h2>
                            <p className="text-gray-400">DNA extracted for {profile.name}</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voice & Tone</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">{profile.voice.tone}</span>
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20">{profile.voice.style}</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visual Identity</h3>
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: profile.visuals.primaryColor }}></div>
                                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: profile.visuals.secondaryColor }}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onComplete(profile)}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                        >
                            Confirm & Continue <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
