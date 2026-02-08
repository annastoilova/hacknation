"use client";

import React, { useState } from 'react';
import Card from '@/components/Card';
import Toggle from '@/components/Toggle';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { Sparkles, Linkedin, Instagram, Copy } from 'lucide-react';
import styles from './ContentStudio.module.css';

interface Brand {
    name: string;
    color: string;
    voice: string;
}

interface ContentStudioProps {
    brand: Brand;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ brand }) => {
    const [platform, setPlatform] = useState('linkedin');
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt) return;

        setStatus('loading');
        setGeneratedContent(null);

        // Simulate AI Generation
        setTimeout(() => {
            const mockResponse = platform === 'linkedin'
                ? `🚀 Exciting news from ${brand.name || 'Us'}!\n\nWe're thrilled to announce [Topic]. It's been a journey of innovation and [Brand Value].\n\n👇 Read more below.\n\n#Innovation #Growth #${brand.name?.replace(/\s/g, '') || 'Brand'}`
                : `✨ creating magic at ${brand.name || 'Us'} ✨\n\n[Topic] is finally here! 🎨\n\nDouble tap if you agree! 💖\n\n#${brand.name?.replace(/\s/g, '') || 'Brand'} #Vibes #New`;

            setGeneratedContent(mockResponse);
            setStatus('success');
        }, 2500);
    };

    const options = [
        { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
        { value: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> }
    ];

    return (
        <Card title="Content Studio" className={styles.studio}>
            <div className={styles.header}>
                <Toggle options={options} value={platform} onChange={setPlatform} />
                <StatusIndicator status={status === 'loading' ? 'loading' : 'idle'} message="Crafting content..." />
            </div>

            <div className={styles.inputArea}>
                <Input
                    type="textarea"
                    placeholder={`What do you want to post about on ${platform}?`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    fullWidth
                />
                <Button onClick={handleGenerate} disabled={status === 'loading'} className={styles.generateBtn}>
                    <Sparkles size={18} />
                    Generate Draft
                </Button>
            </div>

            {generatedContent && (
                <div className={`${styles.result} ${styles.fadeIn}`}>
                    <div className={styles.resultHeader}>
                        <span className={styles.resultLabel}>Draft for {platform}</span>
                        <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(generatedContent)}>
                            <Copy size={14} /> Copy
                        </button>
                    </div>
                    <div className={styles.resultContent}>
                        {generatedContent}
                    </div>
                    {platform === 'instagram' && (
                        <div className={styles.placeholder}>
                            <span>[ AI Generated Image would appear here ]</span>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default ContentStudio;
