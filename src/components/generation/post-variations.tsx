"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, RefreshCw, Eye } from 'lucide-react';
import { GeneratedPost } from '@/src/types/brand';
import Image from 'next/image';

export default function PostVariations({ posts, onSelect, onRegenerate }: { posts: GeneratedPost[], onSelect: (post: GeneratedPost) => void, onRegenerate: () => void }) {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Draft Variations</h2>
                <button onClick={onRegenerate} className="flex gap-2 items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl">
                        <div className="aspect-square relative flex items-center justify-center bg-black">
                            {post.imageUrl && (
                                <Image
                                    src={post.imageUrl}
                                    alt={`Variation ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute top-4 left-4 p-2 bg-black/50 rounded-lg border border-white/10 backdrop-blur-md z-10">
                                {post.platform === 'linkedin' ? <Linkedin className="w-4 h-4 text-blue-400" /> : <Instagram className="w-4 h-4 text-pink-400" />}
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-sm text-zinc-300 line-clamp-4 whitespace-pre-wrap leading-relaxed">{post.caption}</p>
                            <button onClick={() => onSelect(post)} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold flex gap-2 justify-center items-center transition-all">
                                <Eye className="w-4 h-4" /> Preview & Edit
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
