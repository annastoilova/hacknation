import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { generateImage } from 'ai';
import { google } from '@ai-sdk/google';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { post, prompt, brandProfile } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
        }

        // DYNAMIC VOICE LOGIC
        const voice = brandProfile?.voiceSignature || {
            casing: 'sentence-case',
            rhythm: 'variable',
            energy: 'calm'
        };

        const tweakPrompt = `
            Act as a Senior Social Media Strategist for ${brandProfile?.name}.
            
            Current Post:
            Content: ${post.content}
            Platform: ${post.platform}
            Current Image Prompt: ${post.imagePrompt}

            User Request: "${prompt}"

            Apply this request while enforcing these STRICT GUARDRAILS:
            
            1. Dynamic Voice: Casing should be ${voice.casing}. Rhythm should be ${voice.rhythm}.
            2. "Authentic Lens" Visuals: If changing the image, specify "35mm, f/1.8, natural light, film grain".
            3. Anti-Slop: REMOVE words like "unleash", "elevate", "neon", "4k render".
            4. Tone: ${brandProfile?.tone}
            
            Refine both the caption and the imagePrompt to match the request.

            Respond in JSON:
            {
                "content": "refined caption",
                "imagePrompt": "refined visual description",
                "critique": "What was changed and why",
                "score": 98
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: tweakPrompt }],
            response_format: { type: "json_object" },
        });

        const refinedData = JSON.parse(response.choices[0].message.content || '{}');

        // Regenerate image if the prompt suggests a visual change
        let imageUrl = post.imageUrl;
        const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

        if (googleKey) {
            try {
                const isVideo = post.contentType === 'video';
                const baseStyle = "high-end lifestyle photography, 35mm lens, f/1.8, natural lighting, realistic textures, slight film grain, candid, minimalist";
                const videoStyle = "cinematic 4k, natural handheld movement, soft lighting, 35mm look";

                const visualPrompt = isVideo
                    ? `${refinedData.imagePrompt}. ${videoStyle}`
                    : `${refinedData.imagePrompt}. ${baseStyle}`;

                console.log(`[TWEAK] Attempting Gemini Generation: ${visualPrompt}`);

                const { image } = await generateImage({
                    model: google.image('imagen-3.0-generate-001'),
                    prompt: `${visualPrompt} brand-aligned colors: ${brandProfile?.colors?.join(', ') || 'modern'}.`,
                });

                if (image.base64) {
                    imageUrl = `data:image/png;base64,${image.base64}`;
                }
            } catch (err: any) {
                console.error("[TWEAK] Gemini Failed, Falling back to DALL-E 3:", err.message || err);

                // FALLBACK TO DALL-E 3
                try {
                    const dallEResponse = await openai.images.generate({
                        model: "dall-e-3",
                        prompt: `${refinedData.imagePrompt}. Brand style: ${brandProfile?.tone}, Colors: ${brandProfile?.colors?.join(', ')}.`,
                        n: 1,
                        size: "1024x1024",
                    });
                    if (dallEResponse.data?.[0]?.url) {
                        imageUrl = dallEResponse.data[0].url;
                    }
                } catch (dalleErr: any) {
                    console.error("[TWEAK] DALL-E 3 Fallback Failed:", dalleErr.message);
                }
            }
        } else {
            // If key is missing, add a random sig to the existing image URL to force a 'tweak' feel if it was a placeholder
            if (imageUrl.includes('unsplash.com')) {
                imageUrl = `${imageUrl.split('&sig=')[0]}&sig=${Math.random()}`;
            } else {
                // Or just fallback to DALL-E 3 directly
                try {
                    const dallEResponse = await openai.images.generate({
                        model: "dall-e-3",
                        prompt: refinedData.imagePrompt,
                        n: 1,
                        size: "1024x1024",
                    });
                    if (dallEResponse.data?.[0]?.url) {
                        imageUrl = dallEResponse.data[0].url;
                    }
                } catch (err) {
                    console.warn("[TWEAK] DALL-E 3 fallback failed.");
                }
            }
        }

        return NextResponse.json({
            post: {
                ...post,
                ...refinedData,
                imageUrl
            }
        });

    } catch (error: any) {
        console.error("Tweak API Error:", error);
        return NextResponse.json({ error: "Failed to tweak post" }, { status: 500 });
    }
}
