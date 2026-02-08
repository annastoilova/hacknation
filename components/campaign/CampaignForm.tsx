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
    const [contentType, setContentType] = useState<'image' | 'video'>('image');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!intent) return;

        setIsGenerating(true);

        const campaign: Campaign = {
            intent,
            platform,
            contentType,
            date: new Date(),
        };

        setCurrentCampaign(campaign);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intent,
                    platform,
                    contentType,
                    brandProfile,
                }),
            });

            if (!response.ok) throw new Error('Generation failed');

            const data = await response.json();
            setGeneratedPosts(data.posts);
            setIsGenerating(false);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error during generation:', error);
            setIsGenerating(false);
            // Fallback to generic mock if API fails
            const fallbackPosts: Post[] = [
                {
                    id: 'fallback-1',
                    platform: 'linkedin',
                    status: 'draft',
                    contentType: 'image',
                    content: `🚀 Milestone update for ${brandProfile?.name || 'our brand'}! ${intent}. #Lume #Success`,
                    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
                }
            ];
            setGeneratedPosts(fallbackPosts);
            router.push('/dashboard');
        }
    };

    return (
        <section className="w-full relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campaign Architect</h2>
                        <p className="text-slate-600 font-medium text-sm">Design your next viral campaign</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* User Intent */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            What are we announcing?
                        </label>
                        <textarea
                            required
                            rows={4}
                            className="w-full glass-input rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-500 transition-all resize-none"
                            placeholder="e.g. We just won 1st place at Hack-Nation 2026 with our brand new AI sync tool!"
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                        />
                    </div>

                    {/* Platform & Tone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Platform</label>
                            <div className="flex p-1.5 glass-input rounded-xl bg-white/20">
                                {(['linkedin', 'instagram', 'both'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPlatform(p)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold capitalize transition-all ${platform === p
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/70'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Content Type</label>
                            <div className="flex p-1.5 glass-input rounded-xl bg-white/20">
                                {(['image', 'video'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setContentType(t)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-extrabold capitalize transition-all flex items-center justify-center gap-2 ${contentType === t
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/70'
                                            }`}
                                    >
                                        {t === 'image' ? <Layout className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Brand Voice</label>
                            <div className="w-full glass-input rounded-xl px-4 py-3 text-slate-600 flex items-center justify-between">
                                <span className="text-sm font-semibold">{brandProfile?.tone || 'Professional'}</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isGenerating || !intent}
                        className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-indigo-100 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generating Variations & Visuals...</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg">Generate Campaign</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
