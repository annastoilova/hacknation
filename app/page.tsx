"use client";

import React, { useState } from 'react';
import BrandOnboarding from '@/components/brand/BrandOnboarding';

export default function Home() {
  const [brand, setBrand] = useState<{ name: string; color: string; voice: string } | null>(null);

  // Hydration fix for localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('lume_brand');
    if (saved) {
      setBrand(JSON.parse(saved));
    } else {
      setBrand({ name: '', color: '#6366F1', voice: '' });
    }
  }, []);

  if (!brand) return null; // Avoid hydration mismatch

  return (
    <div className="app-container min-h-screen flex flex-col">
      <header className="app-header">
        <div>
          <h1>Lume</h1>
          <p style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Intelligent Social Studio</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2DD4BF' }}></div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>System Online</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <BrandOnboarding />

          <div className="mt-8 p-4 border border-dashed border-white/10 rounded-xl bg-white/5 text-sm text-center">
            <p className="text-gray-400">
              <strong className="text-white">Tip:</strong> The AI uses your Brand Voice settings to tailor every post.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
