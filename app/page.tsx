"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
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
      <Header />


      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <BrandOnboarding />

          <div className="mt-8 p-6 glass-effect rounded-3xl text-sm text-center">
            <p className="text-slate-600">
              <strong className="text-slate-900">Pro Tip:</strong> Our AI analyzes your brand URL to automatically extract your color palette and voice.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

