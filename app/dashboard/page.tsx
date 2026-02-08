'use client';

import { useStore } from '@/lib/store';
import PostCard from '@/components/dashboard/PostCard';
import { ArrowLeft, Sparkles, Wand2, LayoutDashboard, Linkedin, Instagram, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
Riverside,
export default function Dashboard() {
    const router = useRouter();
    const { generatedPosts, brandProfile, currentCampaign, updatePost } = useStore();

    if (!currentCampaign && generatedPosts.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
                <div className="p-6 bg-blue-500/10 rounded-full mb-6">
                    <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Campaign Data Found</h2>
                <p className="text-gray-400 mb-8 max-w-sm">You need to architect a campaign before viewing the studio.</p>
                <Link
                    href="/create"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg"
                >
                    Start Architecting
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            {/* Campaign Metrics & Actions */}
            <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="md:col-span-3 flex flex-wrap items-center gap-4">
                    <div className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-1 min-w-[140px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Readiness Score</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-blue-400">
                                {generatedPosts.length > 0 ? Math.round(generatedPosts.reduce((acc, p) => acc + (p.score || 0), 0) / generatedPosts.length) : 0}%
                            </span>
                            <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${generatedPosts.length > 0 ? Math.round(generatedPosts.reduce((acc, p) => acc + (p.score || 0), 0) / generatedPosts.length) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-1 min-w-[140px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Approvals</span>
                        <span className="text-2xl font-black text-green-400">
                            {generatedPosts.filter(p => p.status === 'approved').length}/{generatedPosts.length}
                        </span>
                    </div>
                    <div className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-1 min-w-[140px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Channels</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="p-1.5 bg-blue-600/20 rounded-lg"><Linkedin className="w-3 h-3 text-blue-400" /></div>
                            <div className="p-1.5 bg-pink-600/20 rounded-lg"><Instagram className="w-3 h-3 text-pink-400" /></div>
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
                        className="group flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 hover:bg-green-500/5 transition-all text-sm font-bold"
                    >
                        <div className="p-2 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex flex-col items-start pr-2 text-left">
                            <span className="text-green-400">Bulk Approve</span>
                            <span className="text-[10px] text-gray-500 font-medium">Auto-approve (85+)</span>
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
                                        colors: ['#3b82f6', '#8b5cf6', '#10b981']
                                    });
                                    btn.innerHTML = '🚀 CAMPAIGN LIVE';
                                    btn.classList.replace('from-purple-600', 'from-green-600');
                                    btn.classList.replace('to-blue-600', 'to-emerald-600');
                                }, 1500);
                            }
                        }}
                        id="publish-btn"
                        className="flex flex-col items-center justify-center px-8 py-4 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20 active:scale-95"
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
                <button className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all group">
                    <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-gray-500 group-hover:text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-300">Generate New Variation</span>
                </button>
            </div>
        </main>
    );
}
