import { create } from 'zustand';

export interface BrandProfile {
    name: string;
    website: string;
    tone: string; // e.g., "Professional", "Playful", "Tech-savvy"
    colors: string[];
    logo?: string; // URL
}

export interface Campaign {
    intent: string;
    platform: 'linkedin' | 'instagram' | 'both';
    date?: Date;
    constraints?: string;
}

export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    platform: 'linkedin' | 'instagram';
    status: 'draft' | 'approved' | 'rejected' | 'scheduled';
}

interface AppState {
    brandProfile: BrandProfile | null;
    setBrandProfile: (profile: BrandProfile) => void;

    currentCampaign: Campaign | null;
    setCurrentCampaign: (campaign: Campaign) => void;

    generatedPosts: Post[];
    setGeneratedPosts: (posts: Post[]) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
}

export const useStore = create<AppState>((set) => ({
    brandProfile: null,
    setBrandProfile: (profile) => set({ brandProfile: profile }),

    currentCampaign: null,
    setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

    generatedPosts: [],
    setGeneratedPosts: (posts) => set({ generatedPosts: posts }),
    updatePost: (id, updates) => set((state) => ({
        generatedPosts: state.generatedPosts.map((post) =>
            post.id === id ? { ...post, ...updates } : post
        )
    })),
}));
