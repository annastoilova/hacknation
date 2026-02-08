"use client";

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from './BrandVault.module.css';

interface Brand {
    name: string;
    color: string;
    voice: string;
}

interface BrandVaultProps {
    onSave?: (brand: Brand) => void;
}

const BrandVault: React.FC<BrandVaultProps> = ({ onSave }) => {
    const [brand, setBrand] = useState<Brand>({
        name: '',
        color: '#6366F1',
        voice: ''
    });

    useEffect(() => {
        const savedBrand = localStorage.getItem('lume_brand');
        if (savedBrand) {
            setBrand(JSON.parse(savedBrand));
            if (onSave) onSave(JSON.parse(savedBrand));
        }
    }, []); // Run once on mount

    const handleChange = (field: keyof Brand, value: string) => {
        setBrand(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('lume_brand', JSON.stringify(brand));
        // Update CSS variable dynamically
        document.documentElement.style.setProperty('--color-primary', brand.color);
        if (onSave) onSave(brand);
    };

    return (
        <Card title="Brand Vault" className={styles.vault}>
            <div className={styles.grid}>
                <Input
                    label="Brand Name"
                    placeholder="e.g. Hack-Nation"
                    value={brand.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />

                <div className={styles.colorGroup}>
                    <label className={styles.label}>Primary Color</label>
                    <div className={styles.colorWrapper}>
                        <input
                            type="color"
                            value={brand.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className={styles.swatch}
                        />
                        <span className={styles.code}>{brand.color}</span>
                    </div>
                </div>

                <Input
                    label="Brand Voice"
                    type="textarea"
                    placeholder="Describe your brand's tone (e.g. Professional, Witty, Empathetic...)"
                    value={brand.voice}
                    onChange={(e) => handleChange('voice', e.target.value)}
                    fullWidth
                    rows={3}
                />

                <Button onClick={handleSave} className={styles.saveBtn}>
                    Save Brand Profile
                </Button>
            </div>
        </Card>
    );
};

export default BrandVault;
