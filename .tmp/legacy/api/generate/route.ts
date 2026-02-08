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

        const generatorPrompt = `
            Act as a social media strategist. Generate one post variation for each specified platform.
            
            Brand: ${brandProfile?.name}
            Brand Tone: ${brandProfile?.tone}
            Campaign Intent: ${intent}
            Platforms: ${platform === 'both' ? 'LinkedIn and Instagram' : platform}

            Focus on high-engagement drafts. Respond in JSON:
            {
                "posts": [
                    { "platform": "linkedin", "content": "draft text" }
                ]
            }
        `;

        const generationResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: generatorPrompt }],
            response_format: { type: "json_object" },
        });

        const initialResult = JSON.parse(generationResponse.choices[0].message.content || '{"posts":[]}');

        // --- STEP 2: CRITIQUE & REFINE ---
        const reviewerPrompt = `
            Act as a Senior Content Editor. Review these social media drafts and refine them for maximum impact.
            
            Brand Context: ${brandProfile?.name} (${brandProfile?.tone})
            Target Intent: ${intent}

            Initial Drafts:
            ${JSON.stringify(initialResult.posts)}

            For each post:
            1. Critique it (what's good, what's weak).
            2. Provide a refined version.
            3. Keep the "critique" concise (1-2 sentences) about the reasoning.

            Return JSON format:
            {
                "refinedPosts": [
                    {
                        "platform": "platform_name",
                        "content": "refined content",
                        "critique": "Agent reasoning here"
                    }
                ]
            }
        `;

        const reviewResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: reviewerPrompt }],
            response_format: { type: "json_object" },
        });

        const finalResult = JSON.parse(reviewResponse.choices[0].message.content || '{"refinedPosts":[]}');

        const postsWithIds = finalResult.refinedPosts.map((post: any) => ({
            ...post,
            id: Math.random().toString(36).substr(2, 9),
            status: 'draft',
            imageUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80`
        }));

        return NextResponse.json({ posts: postsWithIds });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
    }
}
