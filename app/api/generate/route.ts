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
            Act as a social media strategist for ${brandProfile?.name}. 
            Generate one high-performance post variation for each specified platform.
            
            Campaign Intent: ${intent}
            Brand Tone: ${brandProfile?.tone}
            Platforms: ${platform === 'both' ? 'LinkedIn and Instagram' : platform}

            Platform Guidelines:
            - LinkedIn: Professional, industry-leading tone. Start with a strong 'hook' line. Use paragraph breaks for readability. 
            - Instagram: Visual-first, energetic tone. Use relevant emojis. Include 3-5 high-traffic hashtags at the end.

            Respond in JSON:
            {
                "posts": [
                    { "platform": "linkedin", "content": "Full caption here" }
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
            1. Critique it.
            2. Provide a refined version.
            3. Provide a detailed DALL-E 3 image prompt (1 sentence) that matches the post's message and the brand's aesthetic.
            4. Keep the "critique" concise.

            Return JSON format:
            {
                "refinedPosts": [
                    {
                        "platform": "platform_name",
                        "content": "refined content",
                        "critique": "Agent reasoning here",
                        "imagePrompt": "Detailed visual description"
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

        // --- STEP 3: IMAGE GENERATION ---
        const postsWithIds = await Promise.all(finalResult.refinedPosts.map(async (post: any) => {
            let imageUrl = `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80`;

            try {
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: `${post.imagePrompt}. Professional social media style, high quality, clean composition.`,
                    n: 1,
                    size: "1024x1024",
                });

                const generatedUrl = imageResponse.data?.[0]?.url;
                if (generatedUrl) {
                    imageUrl = generatedUrl;
                }
            } catch (err) {
                console.error("Image Gen Error:", err);
            }

            return {
                ...post,
                id: Math.random().toString(36).substr(2, 9),
                status: 'draft',
                imageUrl
            };
        }));

        return NextResponse.json({ posts: postsWithIds });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
    }
}
