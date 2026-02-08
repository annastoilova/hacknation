'use client';

import { useState } from 'react';
import { Post, useStore } from '@/lib/store';
import { Linkedin, Instagram, Share2, Edit3, CheckCircle, Trash2, Sparkles, Calendar, Save, X, Wand2, Loader2, Play } from 'lucide-react';
import FeedPreview from './FeedPreview';

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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { brandProfile } = useStore();
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
        <div className={`group relative rounded-3xl border transition-all hover:shadow-xl flex flex-col h-full overflow-hidden ${post.status === 'approved'
            ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
            : 'glass-effect'
            }`}>
            {/* Header / Meta */}
            <div className="flex items-center justify-between p-4 bg-white/40 border-b border-white/20">
                <div className="flex items-center gap-2">
                    {isLinkedIn ? (
                        <div className="p-1.5 bg-indigo-100 rounded-lg">
                            <Linkedin className="w-4 h-4 text-indigo-600" />
                        </div>
                    ) : (
                        <div className="p-1.5 bg-rose-100 rounded-lg">
                            <Instagram className="w-4 h-4 text-rose-600" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            {post.platform}
                        </span>
                        {post.contentType === 'video' && (
                            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-tighter">Video Post</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${post.status === 'draft' ? 'bg-amber-100 text-amber-700' : post.status === 'scheduled' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {post.contentType === 'video' && (
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 transform scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="p-5 flex-grow flex flex-col">
                {isEditing ? (
                    <div className="space-y-4 flex flex-col h-full">
                        <textarea
                            className="w-full flex-grow glass-input rounded-xl p-4 text-sm text-slate-900 resize-none min-h-[120px]"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 flex flex-col h-full">
                        <p className="text-sm leading-relaxed text-slate-700 font-medium line-clamp-4">
                            {post.content}
                        </p>

                        {/* Agent Thoughts / Critique */}
                        {post.critique && (
                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden group/thoughts">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Sparkles className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/80">Agent Audit</span>
                                    </div>
                                    {post.score && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-100/50 border border-indigo-200">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-indigo-600">{post.score}% Match</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-600 italic font-medium relative z-10">
                                    "{post.critique}"
                                </p>
                            </div>
                        )}

                        <div className="mt-auto pt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onUpdate(post.id, { status: post.status === 'approved' ? 'draft' : 'approved' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${post.status === 'approved'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    {post.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    {post.status === 'approved' ? 'Approved' : 'Review & Approve'}
                                </button>

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
                                    title="Manual Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsTweaking(true)}
                                    className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm"
                                    title="Tweak with AI"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tweak with AI Input */}
                            {isTweaking && (
                                <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-1.5">
                                        <Wand2 className="w-3 h-3" /> Tweak Prompt
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="e.g. 'Make it more playful'"
                                        className="w-full glass-input rounded-xl px-4 py-2 text-xs text-slate-900 mb-3"
                                        value={tweakPrompt}
                                        onChange={(e) => setTweakPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTweak()}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleTweak}
                                            disabled={isApplyingTweak}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold transition-all shadow-sm"
                                        >
                                            {isApplyingTweak ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply Tweak'}
                                        </button>
                                        <button
                                            onClick={() => { setIsTweaking(false); setTweakPrompt(''); }}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] items-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-[10px] text-slate-600 appearance-none transition-all"
                                        onChange={(e) => onUpdate(post.id, { status: 'scheduled' })}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
                                    title="Platform Preview"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">Preview</span>
                                </button>
                                <button className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 transition-all shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FeedPreview
                post={post}
                brandName={brandProfile?.name}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>

    );
}
