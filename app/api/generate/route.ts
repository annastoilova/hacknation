import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { intent, platform, brandProfile } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if API key is missing
            await new Promise(resolve => setTimeout(resolve, 3000));

            const platforms = platform === 'both' ? ['linkedin', 'instagram'] : [platform];
            const mockPosts = platforms.map((p, i) => ({
                id: Math.random().toString(36).substr(2, 9),
                platform: p,
                status: 'draft',
                content: `🚀 Milestone update for ${brandProfile?.name || 'our brand'}! ${intent}. #Innovation #${brandProfile?.name || 'Success'}`,
                imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`
            }));

            return NextResponse.json({ posts: mockPosts });
        }

        const prompt = `
            Act as a world-class social media manager. Generate one high-quality post variation for each specified platform.
            
            Brand: ${brandProfile?.name}
            Brand Tone: ${brandProfile?.tone}
            Campaign Intent: ${intent}
            Platforms: ${platform === 'both' ? 'LinkedIn and Instagram' : platform}

            Rules:
            - LinkedIn posts should be professional, use hooks, and have clear paragraph breaks.
            - Instagram posts should be visual, include emojis, and 3 relevant hashtags.
            - Focus on engagement.

            Return JSON format:
            {
                "posts": [
                    {
                        "platform": "linkedin",
                        "content": "Full caption text here",
                        "imagePrompt": "Description for DALL-E to generate a background image matching this post"
                    }
                ]
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // Use a better model for quality content
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content || '{"posts":[]}');

        // Note: Image generation with DALL-E would be a separate step or added here.
        // For now, we'll provide the content and image prompts.
        const postsWithIds = result.posts.map((post: any) => ({
            ...post,
            id: Math.random().toString(36).substr(2, 9),
            status: 'draft',
            imageUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80` // Placeholder visual
        }));

        return NextResponse.json({ posts: postsWithIds });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
    }
}
