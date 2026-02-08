'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, BrandProfile } from '@/lib/store';
import { Palette, Globe, MessageSquare, ArrowRight } from 'lucide-react';

export default function BrandOnboarding() {
    const router = useRouter();
    const setBrandProfile = useStore((state) => state.setBrandProfile);

    const [formData, setFormData] = useState<BrandProfile>({
        name: '',
        website: '',
        tone: 'Professional',
        colors: ['#000000', '#ffffff'],
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate AI analyzing the brand website (mock delay)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setBrandProfile(formData);
        setIsLoading(false);
        router.push('/create'); // Navigate to campaign creation
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Define Your Brand DNA
                </h2>
                <p className="text-gray-400 mt-2">
                    Tell us about your company, and our AI will adapt to your unique voice.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Company Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Hack-Nation"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Website */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Globe className="w-4 h-4 text-purple-400" />
                        Website URL
                    </label>
                    <input
                        type="url"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="https://hack-nation.ai/"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">We'll scan this to learn your visual style.</p>
                </div>

                {/* Brand Tone */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        Brand Tone
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Professional', 'Playful', 'Visionary', 'Friendly'].map((tone) => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => setFormData({ ...formData, tone })}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.tone === tone
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                    : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Analyzing Brand Identity...</span>
                    ) : (
                        <>
                            Save Brand Profile
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
