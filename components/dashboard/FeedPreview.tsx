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
                        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <span className="text-[10px] font-black uppercase text-blue-400">Contextual Preview</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {isLinkedIn ? (
                                /* LinkedIn Mockup */
                                <div className="bg-white rounded-lg overflow-hidden shadow-sm text-[#000000e6]">
                                    <div className="p-3 flex items-start gap-2">
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">{brandName?.charAt(0)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-bold hover:text-blue-600 cursor-pointer">{brandName}</span>
                                                <span className="text-xs text-gray-500">• 1st</span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal">Building the future of AI marketing</p>
                                            <p className="text-[10px] text-gray-500">2h • Edited • 🌐</p>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                    </div>
                                    {post.imageUrl && (
                                        <div className="w-full bg-gray-100 border-y border-gray-200">
                                            <img src={post.imageUrl} className="w-full h-auto" alt="LinkedIn Content" />
                                        </div>
                                    )}
                                    <div className="p-2 border-b border-gray-100 flex items-center gap-1 text-[#00000099]">
                                        <div className="flex -space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">👍</div>
                                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">❤️</div>
                                        </div>
                                        <span className="text-[10px]">128 • 12 comments</span>
                                    </div>
                                    <div className="px-2 py-1 flex justify-between">
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-gray-100 rounded text-sm font-semibold text-gray-500 transition-colors">
                                            <ThumbsUp className="w-4 h-4" /> Like
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-gray-100 rounded text-sm font-semibold text-gray-500 transition-colors">
                                            <MessageSquare className="w-4 h-4" /> Comment
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-gray-100 rounded text-sm font-semibold text-gray-500 transition-colors">
                                            <Repeat2 className="w-4 h-4" /> Repost
                                        </button>
                                        <button className="flex items-center gap-1.5 p-2 px-3 hover:bg-gray-100 rounded text-sm font-semibold text-gray-500 transition-colors">
                                            <SendIcon className="w-4 h-4" /> Send
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Instagram Mockup */
                                <div className="bg-white rounded-lg border border-gray-200 text-black overflow-hidden shadow-sm">
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-[1.5px]">
                                                <div className="w-full h-full bg-white rounded-full p-[1.5px]">
                                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{brandName?.charAt(0)}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold">{brandName?.toLowerCase().replace(/\s+/g, '_')}</span>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5" />
                                    </div>
                                    {post.imageUrl && (
                                        <div className="aspect-square bg-gray-100">
                                            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Instagram Post" />
                                        </div>
                                    )}
                                    <div className="p-3 pb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer" />
                                            <MessageCircle className="w-6 h-6 hover:text-gray-500 cursor-pointer" />
                                            <Send className="w-6 h-6 hover:text-gray-500 cursor-pointer" />
                                        </div>
                                        <Bookmark className="w-6 h-6 hover:text-gray-500 cursor-pointer" />
                                    </div>
                                    <div className="px-3 pb-3 space-y-1">
                                        <p className="text-sm font-bold">842 likes</p>
                                        <div className="text-sm leading-tight">
                                            <span className="font-bold mr-2">{brandName?.toLowerCase().replace(/\s+/g, '_')}</span>
                                            {post.content}
                                        </div>
                                        <p className="text-[10px] uppercase text-gray-400 tracking-tighter pt-1 font-medium">2 hours ago</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white/[0.02] border-t border-white/5">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10"
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
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </AnimatePresence>
    );
}
