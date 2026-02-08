import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { generateImage } from 'ai';
import { google } from '@ai-sdk/google';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { intent, platform, contentType, brandProfile } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if API key is missing
            await new Promise(resolve => setTimeout(resolve, 3000));

            const platforms = platform === 'both' ? ['linkedin', 'instagram'] : [platform];
            const mockPosts = platforms.map((p, i) => ({
                id: Math.random().toString(36).substr(2, 9),
                platform: p,
                status: 'draft',
                contentType: contentType || 'image',
                content: `🚀 Milestone update for ${brandProfile?.name || 'our brand'}! ${intent}. #Innovation #${brandProfile?.name || 'Success'}`,
                imageUrl: contentType === 'video'
                    ? `https://images.unsplash.com/photo-1492691523567-6170c3295db5?auto=format&fit=crop&w=800&q=80`
                    : `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`
            }));

            return NextResponse.json({ posts: mockPosts });
        }

        const generatorPrompt = `
            Act as a social media strategist for ${brandProfile?.name}. 
            Generate one high-performance post variation for each specified platform.
            
            Campaign Intent: ${intent}
            Brand Tone: ${brandProfile?.tone}
            Platforms: ${platform === 'both' ? 'LinkedIn and Instagram' : platform}
            Content Type: ${contentType || 'image'}

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

        // --- STEP 2: AGENTIC AUDIT & REFINE ---
        const reviewerPrompt = `
            Act as a Senior Content Auditor for ${brandProfile?.name}. 
            Review these social media drafts and refine them.

            Brand Identity: ${brandProfile?.tone}
            Campaign Intent: ${intent}
            Initial Drafts:
            ${JSON.stringify(initialResult.posts)}

            Audit Rules:
            1. Brand Consistency: Does it sound like the specified tone?
            2. Visual Correctness: Does the imagePrompt (or videoPrompt) create a scene that builds on the text?
            3. Engagement: Is the hook strong enough?

            For each post, return:
            - A refined version of the content.
            - A refined visual prompt (imagePrompt or videoPrompt).
            - A detailed critique (Audit findings and reasoning).
            - A brandMatchScore (0-100).

            Return JSON format:
            {
                "refinedPosts": [
                    {
                        "platform": "platform_name",
                        "content": "refined caption",
                        "imagePrompt": "audited visual description (if video, describe a 5-second cinematic clip)",
                        "critique": "Audit findings and reasoning",
                        "score": 95
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

        // --- STEP 3: IMAGE/VIDEO GENERATION (GEMINI / IMAGEN 3) ---
        const postsWithIds = await Promise.all(finalResult.refinedPosts.map(async (post: any) => {
            const seed = Math.floor(Math.random() * 1000000);
            let imageUrl = `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80&sig=${seed}`;

            const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

            if (googleKey) {
                try {
                    const isVideo = contentType === 'video';
                    const visualPrompt = isVideo
                        ? `${post.imagePrompt}. Cinematic 4k video style, high motion, dynamic lighting.`
                        : `${post.imagePrompt}. Professional social media style, high quality, clean composition.`;

                    console.log(`[DEBUG] Attempting Gemini Generation: ${visualPrompt}`);

                    // Use imagen-3 or imagen-4 based on key's capability
                    const { image } = await generateImage({
                        model: google.image('imagen-3.0-generate-001'),
                        prompt: `${visualPrompt} brand-aligned colors: ${brandProfile?.colors?.join(', ') || 'modern'}.`,
                    });

                    if (image.base64) {
                        imageUrl = `data:image/png;base64,${image.base64}`;
                    }
                } catch (err: any) {
                    console.error("[DEBUG] Gemini Failed, Falling back to DALL-E 3:", err.message || err);

                    // FALLBACK TO DALL-E 3
                    try {
                        const dallEResponse = await openai.images.generate({
                            model: "dall-e-3",
                            prompt: `${post.imagePrompt}. Brand style: ${brandProfile?.tone}, Colors: ${brandProfile?.colors?.join(', ')}.`,
                            n: 1,
                            size: "1024x1024",
                            quality: "standard"
                        });
                        if (dallEResponse.data?.[0]?.url) {
                            imageUrl = dallEResponse.data[0].url;
                        }
                    } catch (dalleErr: any) {
                        console.error("[DEBUG] DALL-E 3 Fallback Failed:", dalleErr.message);
                    }
                }
            } else {
                console.warn("[DEBUG] Google API Key missing, falling back to DALL-E 3.");
                try {
                    const dallEResponse = await openai.images.generate({
                        model: "dall-e-3",
                        prompt: post.imagePrompt,
                        n: 1,
                        size: "1024x1024",
                    });
                    if (dallEResponse.data?.[0]?.url) {
                        imageUrl = dallEResponse.data[0].url;
                    }
                } catch (err) {
                    console.warn("[DEBUG] DALL-E 3 also failed, using placeholder.");
                }
            }

            return {
                ...post,
                id: Math.random().toString(36).substr(2, 9),
                status: 'draft',
                contentType: contentType || 'image',
                imageUrl
            };
        }));

        return NextResponse.json({ posts: postsWithIds });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
    }
}
