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

        // Normalize URL (ensure it has a protocol)
        let normalizedWebsite = formData.website.trim();
        if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
            normalizedWebsite = `https://${normalizedWebsite}`;
        }

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    website: normalizedWebsite,
                    name: formData.name,
                    tone: formData.tone,
                }),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();

            setBrandProfile({
                ...formData,
                name: data.name || formData.name,
                website: normalizedWebsite,
                tone: data.refinedTone || formData.tone,
                colors: data.colors || formData.colors,
            });

            setIsLoading(false);
            router.push('/create'); // Navigate to campaign creation
        } catch (error) {
            console.error('Error during analysis:', error);
            setIsLoading(false);
            // Fallback to local data if API fails
            setBrandProfile({ ...formData, website: normalizedWebsite });
            router.push('/create');
        }
    };

    return (
        <div className="w-full glass-effect p-10 rounded-[32px]">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-[#6366F1] tracking-tight">
                    Define Your Brand DNA
                </h2>
                <p className="text-slate-600 mt-3 text-lg font-medium">
                    Connect your presence, and watch Lume adapt to your unique voice.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Name */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-700">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Company Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full glass-input rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400"
                        placeholder="e.g. Hack-Nation"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Website */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-700">
                        <Globe className="w-4 h-4 text-purple-500" />
                        Website URL
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full glass-input rounded-xl px-4 py-4 text-slate-900 placeholder-slate-500"
                        placeholder="hack-nation.ai"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 ml-1">We'll scan this to learn your visual style.</p>
                </div>

                {/* Brand Tone */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-700">
                        <div className="w-4 h-4 border border-emerald-500 rounded-sm"></div>
                        Brand Tone
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {['Professional', 'Playful', 'Visionary', 'Friendly'].map((tone) => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => setFormData({ ...formData, tone })}
                                className={`py-4 rounded-xl border text-[15px] font-semibold transition-all ${formData.tone === tone
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                                    : 'bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white/80 hover:border-slate-300/80 shadow-sm'
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
                    className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:opacity-95 text-white font-bold py-5 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
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

