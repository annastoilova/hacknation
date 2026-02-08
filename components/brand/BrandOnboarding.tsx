'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, BrandProfile } from '@/lib/store';
import { Globe, ArrowRight } from 'lucide-react';

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
        <div className="w-full bg-[#111111] p-10 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold text-[#A78BFA] tracking-tight">
                    Define Your Brand DNA
                </h2>
                <p className="text-gray-400 mt-3 text-lg">
                    Tell us about your company, and our AI will adapt to your unique voice.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Name */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[15px] font-medium text-gray-200">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Company Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="e.g. Hack-Nation"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Website */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[15px] font-medium text-gray-200">
                        <Globe className="w-4 h-4 text-purple-400" />
                        Website URL
                    </label>
                    <input
                        type="url"
                        required
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                        placeholder="https://hack-nation.ai/"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 ml-1">We'll scan this to learn your visual style.</p>
                </div>

                {/* Brand Tone */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[15px] font-medium text-gray-200">
                        <div className="w-4 h-4 border border-green-500 rounded-sm"></div>
                        Brand Tone
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {['Professional', 'Playful', 'Visionary', 'Friendly'].map((tone) => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => setFormData({ ...formData, tone })}
                                className={`py-4 rounded-xl border text-[15px] font-medium transition-all ${formData.tone === tone
                                    ? 'bg-[#1e293b]/40 border-blue-500 text-blue-400'
                                    : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5'
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
                    className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#9333EA] hover:opacity-90 text-white font-bold py-5 rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Analyzing Brand Identity...</span>
                    ) : (
                        <>
                            <span className="text-lg">Save Brand Profile</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
