'use client';

import { Post } from '@/lib/store';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Send as SendIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedPreviewProps {
    post: Post;
    brandName?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedPreview({ post, brandName, isOpen, onClose }: FeedPreviewProps) {
    const isLinkedIn = post.platform === 'linkedin';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl">
                                    <span className="text-[10px] font-black uppercase text-indigo-600">Contextual Preview</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                            {isLinkedIn ? (
                                /* LinkedIn Mockup */
                                <div className="bg-white rounded-lg overflow-hidden shadow-sm text-[#000000e6] border border-slate-200">
                                    <div className="p-3 flex items-start gap-2">
                                        <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">{brandName?.charAt(0)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-bold hover:text-indigo-600 cursor-pointer">{brandName}</span>
                                                <span className="text-xs text-slate-600">• 1st</span>
                                            </div>
                                            <p className="text-xs text-slate-600 font-normal">Building the future of AI marketing</p>
                                            <p className="text-[10px] text-slate-600">2h • Edited • 🌐</p>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-slate-500 cursor-pointer" />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <p className="text-sm shadow-none whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                    </div>
                                    {post.imageUrl && (
                                        <div className="w-full bg-slate-50 border-y border-slate-100">
                                            <img src={post.imageUrl} className="w-full h-auto" alt="LinkedIn Content" />
                                        </div>
                                    )}
                                    <div className="p-2 border-b border-slate-100 flex items-center gap-1 text-[#00000099]">
                                        <div className="flex -space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">👍</div>
                                            <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">❤️</div>
                                        </div>
                                        <span className="text-[10px]">128 • 12 comments</span>
                                    </div>
                                    <div className="px-2 py-1 flex justify-between">
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-slate-50 rounded text-sm font-semibold text-slate-500 transition-colors">
                                            <ThumbsUp className="w-4 h-4" /> Like
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-slate-50 rounded text-sm font-semibold text-slate-500 transition-colors">
                                            <MessageSquare className="w-4 h-4" /> Comment
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-slate-50 rounded text-sm font-semibold text-slate-500 transition-colors">
                                            <Repeat2 className="w-4 h-4" /> Repost
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-slate-50 rounded text-sm font-semibold text-slate-500 transition-colors">
                                            <SendIcon className="w-4 h-4" /> Send
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Instagram Mockup */
                                <div className="bg-white rounded-lg border border-slate-200 text-black overflow-hidden shadow-sm">
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 rounded-full p-[1.5px]">
                                                <div className="w-full h-full bg-white rounded-full p-[1.5px]">
                                                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">{brandName?.charAt(0)}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold">{brandName?.toLowerCase().replace(/\s+/g, '_')}</span>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </div>
                                    {post.imageUrl && (
                                        <div className="aspect-square bg-slate-50">
                                            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Instagram Post" />
                                        </div>
                                    )}
                                    <div className="p-3 pb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Heart className="w-6 h-6 hover:text-rose-500 cursor-pointer" />
                                            <MessageCircle className="w-6 h-6 hover:text-slate-500 cursor-pointer" />
                                            <Send className="w-6 h-6 hover:text-slate-500 cursor-pointer" />
                                        </div>
                                        <Bookmark className="w-6 h-6 hover:text-slate-500 cursor-pointer" />
                                    </div>
                                    <div className="px-3 pb-3 space-y-1">
                                        <p className="text-sm font-bold">842 likes</p>
                                        <div className="text-sm leading-tight text-slate-800">
                                            <span className="font-bold mr-2">{brandName?.toLowerCase().replace(/\s+/g, '_')}</span>
                                            {post.content}
                                        </div>
                                        <p className="text-[10px] uppercase text-slate-400 tracking-tighter pt-1 font-medium">2 hours ago</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white/50 border-t border-slate-100">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-bold transition-all border border-slate-200 text-slate-700"
                            >
                                Close Preview
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
            `}</style>

        </AnimatePresence>
    );
}
