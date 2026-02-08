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

        // DYNAMIC VOICE LOGIC
        const voice = brandProfile?.voiceSignature || {
            casing: 'sentence-case',
            rhythm: 'variable',
            energy: 'calm',
            preferredVocabulary: [],
            buzzwordsToAvoid: []
        };

        const generatorPrompt = `
            Act as a Senior Creative Director for ${brandProfile?.name}. 
            Generate exactly ONE high-performance post variation for each specified platform.
            
            Campaign Intent: ${intent}
            Brand Tone: ${brandProfile?.tone}
            Platforms: ${platform === 'both' ? 'LinkedIn and Instagram' : platform}
            Content Type: ${contentType || 'image'}

            DYNAMIC VOICE IDENTITY (STRICT):
            1. Casing: ${voice.casing === 'lowercase' ? 'Use lowercase only (e.g. "we are building")' : 'Use sentence case (standard grammar)'}.
            2. Rhythm: ${voice.rhythm === 'punchy' ? 'Short, impactful sentences. fragmented thoughts.' : 'Professional, well-structured sentences.'}.
            3. Energy: ${voice.energy === 'high' ? 'High energy! Use exclamation points sparingly but effectively.' : 'Calm, confident, understated.'}.
            4. Vocabulary: PREFER unique words like [${voice.preferredVocabulary?.join(', ') || 'authentic, real'}]. AVOID [${voice.buzzwordsToAvoid?.join(', ')}].

            COPY AESTHETIC GUARDRAILS:
            1. No perfect 3-sentence paragraphs.
            2. Emoji Constraint: Maximum 1 emoji per post. NEVER use: 🚀, 🔥, 🧠.
            3. Cliche Blacklist: NEVER use "unleash", "game-changer", "elevate".

            VISUAL AESTHETIC GUARDRAILS:
            1. "Authentic Lens": Natural lighting, 35mm, f/1.8, film grain.
            2. Anti-Slop: NO neon glows, NO 3D renders.
            
            Platform Specifics:
            - LinkedIn: Professional but human. Hook early.
            - Instagram: ONE OPTION ONLY. Visual-first. aesthetic. 3-5 curated hashtags.

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
            Act as a Senior Brand Guardian for ${brandProfile?.name}. 
            Review these drafts. Enforce the "Authentic Lens" and "Dynamic Voice" guidelines.
            
            Brand Identity: ${brandProfile?.tone}
            Voice Signature:
            - Casing: ${voice.casing}
            - Rhythm: ${voice.rhythm}
            - Energy: ${voice.energy}

            Campaign Intent: ${intent}
            Initial Drafts:
            ${JSON.stringify(initialResult.posts)}

            STRICT AUDIT RULES:
            1. Dynamic Voice: Does the casing match (${voice.casing})? Is the rhythm right (${voice.rhythm})?
            2. Cliche Check: Remove "unleash", "elevate", "transform". Replace with: ${voice.preferredVocabulary?.join(', ') || 'simple verbs'}.
            3. Visual Vibe: Ensure the image/video prompt specifies "35mm", "f/1.8", "film grain", "natural light".
            4. Anti-Slop: Remove "neon", "cyberpunk", "hyper-realistic".
            5. Emoji Police: Max 1 emoji. No rockets.

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
                        "imagePrompt": "audited visual description (high-end lifestyle photography, 35mm lens, natural light)",
                        "critique": "Audit findings...",
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
                    const baseStyle = "high-end lifestyle photography, 35mm lens, f/1.8, natural lighting, realistic textures, slight film grain, candid, minimalist";
                    const videoStyle = "cinematic 4k, natural handheld movement, soft lighting, 35mm look";

                    const visualPrompt = isVideo
                        ? `${post.imagePrompt}. ${videoStyle}`
                        : `${post.imagePrompt}. ${baseStyle}`;

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
