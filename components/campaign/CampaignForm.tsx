'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, Campaign, Post } from '@/lib/store';
import { Layout, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CampaignForm() {
    const router = useRouter();
    const brandProfile = useStore((state) => state.brandProfile);
    const setCurrentCampaign = useStore((state) => state.setCurrentCampaign);
    const setGeneratedPosts = useStore((state) => state.setGeneratedPosts);

    const [intent, setIntent] = useState('');
    const [platform, setPlatform] = useState<'linkedin' | 'instagram' | 'both'>('both');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!intent) return;

        setIsGenerating(true);

        const campaign: Campaign = {
            intent,
            platform,
            date: new Date(),
        };

        setCurrentCampaign(campaign);

        // Mock AI Generation Logic
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockPosts: Post[] = [
            {
                id: '1',
                platform: 'linkedin',
                status: 'draft',
                content: `🚀 Big news from ${brandProfile?.name || 'our team'}! We're thrilled to announce our latest milestone in sync with Hack-Nation. ${intent}. #Innovation #Tech`,
                imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
            },
            {
                id: '2',
                platform: 'instagram',
                status: 'draft',
                content: `Leveling up! ✨ ${intent}. Stay tuned for more updates from ${brandProfile?.name || 'us'}. 🎯 #BrandSync #SocialMedia`,
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
            },
            {
                id: '3',
                platform: 'linkedin',
                status: 'draft',
                content: `Reflecting on our journey at ${brandProfile?.name || 'the company'}. ${intent}. Proud of what we've built.`,
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
            }
        ];

        setGeneratedPosts(mockPosts);
        setIsGenerating(false);
        router.push('/dashboard');
    };

    return (
        <section className="w-full max-w-3xl glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full animate-pulse" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Campaign Architect</h2>
                        <p className="text-gray-400 text-sm">Design your next viral campaign</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* User Intent */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300 ml-1">
                            What are we announcing?
                        </label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none shadow-inner"
                            placeholder="e.g. We just won 1st place at Hack-Nation 2026 with our brand new AI sync tool!"
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                        />
                    </div>

                    {/* Platform & Tone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 ml-1">Platform</label>
                            <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
                                {(['linkedin', 'instagram', 'both'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPlatform(p)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${platform === p
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 ml-1">Brand Voice</label>
                            <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-gray-400 flex items-center justify-between">
                                <span className="text-sm">{brandProfile?.tone || 'Professional'}</span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isGenerating || !intent}
                        className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generating Variations...</span>
                            </div>
                        ) : (
                            <>
                                <span>Generate Campaign</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
            `}</style>
        </section>
    );
}
