export interface BrandProfile {
    name: string;
    voice: {
        tone: string; // e.g., "Professional", "Playful", "Sarcastic"
        style: string; // e.g., "Minimalist", "Detailed"
        keywords: string[]; // e.g., ["Innovative", "Trust", "Growth"]
        emojis: boolean;
    };
    visuals: {
        primaryColor: string;
        secondaryColor: string;
        fontStyle: 'serif' | 'sans-serif' | 'mono';
        imageStyle: string; // e.g., "Photorealistic", "Flat Art", "Neon"
    };
    values: string[];
    audience: string;
}

export type BrandAnalysisInput = {
    url?: string;
    files?: File[];
    description?: string;
};

export interface CampaignIntent {
    topic: string;
    platforms: ('linkedin' | 'instagram')[];
    toneModifier: string; // e.g., "More professional", "Very excited"
    goals: string[];
}

export interface GeneratedPost {
    id: string;
    platform: 'linkedin' | 'instagram';
    caption: string;
    imageUrl?: string;
    status: 'draft' | 'critiquing' | 'refining' | 'ready';
    feedback?: string;
}


