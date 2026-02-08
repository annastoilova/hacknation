import { BrandProfile, CampaignIntent, GeneratedPost } from '@/types/brand';

export async function generatePosts(brandProfile: BrandProfile, intent: CampaignIntent): Promise<GeneratedPost[]> {
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const variations: GeneratedPost[] = [];

    intent.platforms.forEach((platform, idx) => {
        // Variation 1: Direct & Bold
        variations.push({
            id: `${platform}-1`,
            platform,
            caption: platform === 'linkedin'
                ? `🚀 ${intent.topic}\n\nWe're thrilled to share our latest milestone. Built with the same ${brandProfile.voice.tone} energy you expect from ${brandProfile.name}.\n\n#${brandProfile.name.replace(/\s+/g, '')} #Innovation #Scale`
                : `${intent.topic} 🚀✨\n\nFresh off the press from ${brandProfile.name}. We're making waves. 🌊\n\n#${brandProfile.name.replace(/\s+/g, '')} #Vibe #NextGen`,
            imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop`,
            status: 'draft'
        });

        // Variation 2: Story-driven
        variations.push({
            id: `${platform}-2`,
            platform,
            caption: platform === 'linkedin'
                ? `The journey behind ${intent.topic}...\n\nIt wasn't easy, but staying true to our values of ${brandProfile.values.join(', ')} helped us cross the finish line.\n\nWhat do you think of this approach? 👇`
                : `How it started vs. How it's going: ${intent.topic} Edition. 📈\n\n${brandProfile.name} is evolving. Join the journey.\n\n${brandProfile.voice.emojis ? '✨🙌🔥' : ''}`,
            imageUrl: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop`,
            status: 'draft'
        });
    });

    return variations.slice(0, 3); // Return top 3 variations
}
