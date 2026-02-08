'use client';

import { useStore } from '@/lib/store';
import PostCard from '@/components/dashboard/PostCard';
import { ArrowLeft, Sparkles, Wand2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
            {/* Nav Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Studio Workspace</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Content Studio</h1>
                    <p className="text-gray-400 font-medium">
                        Refining <span className="text-gray-200">"{currentCampaign?.intent}"</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/create')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Adjust Intent
                    </button>
                    <button
                        onClick={() => {
                            const btn = document.getElementById('publish-btn');
                            if (btn) {
                                btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Publishing...';
                                setTimeout(() => {
                                    btn.innerHTML = '🚀 Workspace Published';
                                    btn.classList.replace('from-purple-600', 'from-green-600');
                                    btn.classList.replace('to-blue-600', 'to-emerald-600');
                                }, 2000);
                            }
                        }}
                        id="publish-btn"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all text-sm font-bold shadow-xl shadow-purple-500/10 min-w-[160px] justify-center"
                    >
                        <Wand2 className="w-4 h-4" />
                        Publish Workspace
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
