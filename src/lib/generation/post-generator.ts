import { BrandProfile, CampaignIntent, GeneratedPost } from '@/src/types/brand';

export async function generatePosts(brandProfile: BrandProfile, intent: CampaignIntent): Promise<GeneratedPost[]> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const variations: GeneratedPost[] = [];
    intent.platforms.forEach((platform, idx) => {
        variations.push({
            id: `${platform}-1`,
            platform,
            caption: `🚀 ${intent.topic}\n\nBuilt with ${brandProfile.name} in mind.`,
            imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop`,
            status: 'draft'
        });
        variations.push({
            id: `${platform}-2`,
            platform,
            caption: `The journey into ${intent.topic} starts here.`,
            imageUrl: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop`,
            status: 'draft'
        });
    });
    return variations.slice(0, 3);
}
