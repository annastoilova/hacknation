"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Check, Copy, RefreshCw, Eye } from 'lucide-react';
import { GeneratedPost } from '@/types/brand';
import clsx from 'clsx';

interface PostVariationsProps {
    posts: GeneratedPost[];
    onSelect: (post: GeneratedPost) => void;
    onRegenerate: () => void;
}

export default function PostVariations({ posts, onSelect, onRegenerate }: PostVariationsProps) {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Draft Variations</h2>
                    <p className="text-gray-400">We've generated 3 options based on your brand DNA.</p>
                </div>
                <button
                    onClick={onRegenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-700 transition-all"
                >
                    <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative flex flex-col bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl"
                    >
                        {/* Platform Badge */}
                        <div className="absolute top-4 left-4 z-10">
                            <div className={clsx(
                                "flex items-center justify-center p-2 rounded-lg backdrop-blur-md border",
                                post.platform === 'linkedin' ? "bg-blue-600/20 border-blue-500/30 text-blue-400" : "bg-pink-600/20 border-pink-500/30 text-pink-400"
                            )}>
                                {post.platform === 'linkedin' ? <Linkedin className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                            </div>
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-square relative overflow-hidden bg-gray-950">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={`Variation ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Caption Preview */}
                        <div className="p-5 flex-grow space-y-4">
                            <div className="text-sm text-gray-300 line-clamp-4 font-light leading-relaxed whitespace-pre-wrap">
                                {post.caption}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Variation {idx + 1}</span>
                                <div className="flex-grow border-t border-gray-800" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2 bg-gray-950/50 flex gap-2">
                            <button
                                onClick={() => onSelect(post)}
                                className="flex-grow bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" /> Preview & Edit
                            </button>
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
