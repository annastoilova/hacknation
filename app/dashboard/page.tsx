'use client';

import { useStore } from '@/lib/store';
import PostCard from '@/components/dashboard/PostCard';
import { ArrowLeft, Sparkles, Wand2, LayoutDashboard, Linkedin, Instagram, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Header from '@/components/Header';

export default function Dashboard() {
    const router = useRouter();
    const { generatedPosts, brandProfile, currentCampaign, updatePost } = useStore();

    if (!currentCampaign && generatedPosts.length === 0) {
        return (
            <div className="app-container min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                    <div className="p-6 bg-indigo-100 rounded-full mb-6">
                        <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">No Campaign Data Found</h2>
                    <p className="text-slate-600 mb-8 max-w-sm font-medium">You need to architect a campaign before viewing the studio.</p>
                    <Link
                        href="/create"
                        className="px-8 py-3 bg-indigo-600 hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-lg"
                    >
                        Start Architecting
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="app-container min-h-screen flex flex-col pb-12">
            <Header />
            <div className="p-6 md:p-12">
                {/* Campaign Metrics & Actions */}
                <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="md:col-span-3 flex flex-wrap items-center gap-4">
                        <div className="px-6 py-4 rounded-3xl glass-effect flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Readiness Score</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-indigo-600">
                                    {generatedPosts.length > 0 ? Math.round(generatedPosts.reduce((acc, p) => acc + (p.score || 0), 0) / generatedPosts.length) : 0}%
                                </span>
                                <div className="h-1.5 w-12 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${generatedPosts.length > 0 ? Math.round(generatedPosts.reduce((acc, p) => acc + (p.score || 0), 0) / generatedPosts.length) : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 rounded-3xl glass-effect flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Approvals</span>
                            <span className="text-2xl font-black text-emerald-600">
                                {generatedPosts.filter(p => p.status === 'approved').length}/{generatedPosts.length}
                            </span>
                        </div>
                        <div className="px-6 py-4 rounded-3xl glass-effect flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Channels</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="p-1.5 bg-indigo-100 rounded-lg"><Linkedin className="w-3 h-3 text-indigo-600" /></div>
                                <div className="p-1.5 bg-rose-100 rounded-lg"><Instagram className="w-3 h-3 text-rose-600" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-end gap-3">
                        <button
                            onClick={() => {
                                generatedPosts.forEach(post => {
                                    if (post.status === 'draft' && (post.score || 0) >= 85) {
                                        updatePost(post.id, { status: 'approved' });
                                    }
                                });
                            }}
                            className="group flex items-center gap-3 px-6 py-4 rounded-3xl glass-effect hover:border-emerald-500/30 hover:bg-emerald-50/50 transition-all text-sm font-bold"
                        >
                            <div className="p-2 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex flex-col items-start pr-2 text-left">
                                <span className="text-emerald-700">Bulk Approve</span>
                                <span className="text-[10px] text-slate-600 font-medium">Auto-approve (85+)</span>
                            </div>
                        </button>

                        <button
                            onClick={async () => {
                                const btn = document.getElementById('publish-btn');
                                if (btn && !btn.innerText.includes('Live')) {
                                    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> SYNCING...';
                                    setTimeout(() => {
                                        confetti({
                                            particleCount: 150,
                                            spread: 70,
                                            origin: { y: 0.6 },
                                            colors: ['#6366f1', '#a855f7', '#10b981']
                                        });
                                        btn.innerHTML = '🚀 CAMPAIGN LIVE';
                                        btn.classList.replace('from-indigo-600', 'from-emerald-600');
                                        btn.classList.replace('to-violet-600', 'to-teal-600');
                                    }, 1500);
                                }
                            }}
                            id="publish-btn"
                            className="flex flex-col items-center justify-center px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 transition-all font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-200 active:scale-95"
                        >
                            Ship Campaign
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {generatedPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onUpdate={updatePost}
                        />
                    ))}

                    {/* Placeholder Add Card */}
                    <button className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-white/20 hover:bg-white/40 hover:border-slate-300 transition-all group">
                        <div className="p-4 bg-white rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800">Generate New Variation</span>
                    </button>
                </div>
            </div>
        </main>
    );
}

