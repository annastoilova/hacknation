'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="app-header">
            <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
                <Image
                    src="/logo.png"
                    alt="Lume Logo"
                    width={110}
                    height={36}
                    className="object-contain"
                    priority
                />
            </Link>
            <div className="glass-effect px-4 py-2 rounded-full flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
                <span className="text-[0.875rem] text-slate-600 font-semibold">System Online</span>
            </div>
        </header>
    );
}
