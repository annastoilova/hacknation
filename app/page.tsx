"use client";

import React, { useState } from 'react';
import BrandVault from '@/components/BrandVault';
import ContentStudio from '@/components/ContentStudio';

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
    <div className="app-container">
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

      <main>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <BrandVault onSave={setBrand} />
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <strong>Tip:</strong> The AI uses your Brand Voice settings to tailor every post.
            </div>
          </div>

          <div>
            {brand.name ? (
              <ContentStudio brand={brand} />
            ) : (
              <div style={{
                padding: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'var(--color-text-muted)',
                background: 'rgba(30,30,30, 0.2)'
              }}>
                Please set up your Brand Profile to unlock the Studio.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
