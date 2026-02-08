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

        const tweakPrompt = `
            Act as a Senior Social Media Strategist for ${brandProfile?.name}.
            
            Current Post:
            Content: ${post.content}
            Platform: ${post.platform}
            Current Image Prompt: ${post.imagePrompt}

            User Request: "${prompt}"

            Apply this request to the post while maintaining the brand's tone (${brandProfile?.tone}).
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
                const visualPrompt = isVideo
                    ? `${refinedData.imagePrompt}. Cinematic 4k video style, high motion, dynamic lighting.`
                    : `${refinedData.imagePrompt}. Professional social media style, high quality, clean composition.`;

                console.log(`[TWEAK] Generating Gemini ${isVideo ? 'video frame' : 'image'} for prompt: ${visualPrompt}`);

                const { image } = await generateImage({
                    model: google.image('imagen-3.0-generate-001'),
                    prompt: `${visualPrompt} brand-aligned colors: ${brandProfile?.colors?.join(', ') || 'modern'}.`,
                });

                if (image.base64) {
                    imageUrl = `data:image/png;base64,${image.base64}`;
                }
            } catch (err: any) {
                console.error("[TWEAK] Gemini Visual Gen Error:", err.message || err);
            }
        } else {
            // If key is missing, add a random sig to the existing image URL to force a 'tweak' feel if it was a placeholder
            if (imageUrl.includes('unsplash.com')) {
                imageUrl = `${imageUrl.split('&sig=')[0]}&sig=${Math.random()}`;
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
