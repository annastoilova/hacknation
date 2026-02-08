'use client';

import { Post } from '@/lib/store';
import { Linkedin, Instagram, Share2, Edit3, CheckCircle, Trash2, Sparkles } from 'lucide-react';

interface PostCardProps {
    post: Post;
    onUpdate: (id: string, updates: Partial<Post>) => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
    const isLinkedIn = post.platform === 'linkedin';

    return (
        <div className="group relative glass-card rounded-3xl border border-white/10 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/5">
            {/* Header / Meta */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    {isLinkedIn ? (
                        <div className="p-1.5 bg-blue-600/20 rounded-lg">
                            <Linkedin className="w-4 h-4 text-blue-400" />
                        </div>
                    ) : (
                        <div className="p-1.5 bg-pink-600/20 rounded-lg">
                            <Instagram className="w-4 h-4 text-pink-400" />
                        </div>
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {post.platform}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        {post.status}
                    </span>
                </div>
            </div>

            {/* Image Preview */}
            {post.imageUrl && (
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                    <img
                        src={post.imageUrl}
                        alt="Generation preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Content Body */}
            <div className="p-5 space-y-4">
                <p className="text-sm leading-relaxed text-gray-200 font-medium line-clamp-4">
                    {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={() => onUpdate(post.id, { status: post.status === 'approved' ? 'draft' : 'approved' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${post.status === 'approved'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {post.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {post.status === 'approved' ? 'Approved' : 'Review & Approve'}
                    </button>

                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Agent Thoughts / Critique */}
                {post.critique && (
                    <div className="mt-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group/thoughts">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Agent Thoughts</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-400 italic font-medium relative z-10">
                            "{post.critique}"
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(12px);
                }
            `}</style>
        </div>
    );
}
