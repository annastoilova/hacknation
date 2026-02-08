'use client';

import { useState } from 'react';
import { Post, useStore } from '@/lib/store';
import { Linkedin, Instagram, Share2, Edit3, CheckCircle, Trash2, Sparkles, Calendar, Save, X, Wand2, Loader2 } from 'lucide-react';

interface PostCardProps {
    post: Post;
    onUpdate: (id: string, updates: Partial<Post>) => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isTweaking, setIsTweaking] = useState(false);
    const [tweakPrompt, setTweakPrompt] = useState('');
    const [editContent, setEditContent] = useState(post.content);
    const [isApplyingTweak, setIsApplyingTweak] = useState(false);
    const isLinkedIn = post.platform === 'linkedin';

    const handleSave = () => {
        onUpdate(post.id, { content: editContent, status: 'approved' });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(post.content);
        setIsEditing(false);
    };

    const handleTweak = async () => {
        if (!tweakPrompt.trim()) return;
        setIsApplyingTweak(true);

        try {
            const response = await fetch('/api/tweak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post,
                    prompt: tweakPrompt,
                    brandProfile: useStore.getState().brandProfile
                }),
            });

            const data = await response.json();
            if (data.post) {
                onUpdate(post.id, data.post);
                setIsTweaking(false);
                setTweakPrompt('');
            }
        } catch (err) {
            console.error("Tweak error:", err);
        } finally {
            setIsApplyingTweak(false);
        }
    };

    return (
        <div className="group relative glass-card rounded-3xl border border-white/10 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col h-full">
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
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        {post.status}
                    </span>
                </div>
            </div>

            {/* Image Preview */}
            {!isEditing && post.imageUrl && (
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
            <div className="p-5 flex-grow flex flex-col">
                {isEditing ? (
                    <div className="space-y-4 flex flex-col h-full">
                        <textarea
                            className="w-full flex-grow bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none min-h-[120px]"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 flex flex-col h-full">
                        <p className="text-sm leading-relaxed text-gray-200 font-medium line-clamp-4">
                            {post.content}
                        </p>

                        {/* Agent Thoughts / Critique */}
                        {post.critique && (
                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group/thoughts">
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <Sparkles className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-blue-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Agent Audit</span>
                                    </div>
                                    {post.score && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                                            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                            <span className="text-[10px] font-bold text-blue-300">{post.score}% Match</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] leading-relaxed text-gray-400 italic font-medium relative z-10">
                                    "{post.critique}"
                                </p>
                            </div>
                        )}

                        <div className="mt-auto pt-4 space-y-4">
                            <div className="flex items-center gap-2">
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

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                                    title="Manual Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsTweaking(true)}
                                    className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                                    title="Tweak with AI"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tweak with AI Input */}
                            {isTweaking && (
                                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
                                        <Wand2 className="w-3 h-3" /> Tweak Prompt
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="e.g. 'Make it more playful' or 'Add a city skyline'"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 mb-3"
                                        value={tweakPrompt}
                                        onChange={(e) => setTweakPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTweak()}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleTweak}
                                            disabled={isApplyingTweak}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold transition-all shadow-lg"
                                        >
                                            {isApplyingTweak ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply Tweak'}
                                        </button>
                                        <button
                                            onClick={() => { setIsTweaking(false); setTweakPrompt(''); }}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-[10px] items-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-[10px] text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none transition-all hover:border-white/20"
                                        onChange={(e) => onUpdate(post.id, { status: 'scheduled' })}
                                    />
                                </div>
                                <button className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(12px);
                }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
