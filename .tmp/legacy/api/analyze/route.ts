import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { website, name, tone } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if API key is missing
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({
                name: name || "Lume Brand",
                website,
                tone,
                colors: ['#2563EB', '#9333EA'],
                analysis: "This is a mock analysis because no OpenAI API key was found in the environment."
            });
        }

        const prompt = `
            Analyze the following brand information and extract its "DNA" for social media content generation.
            
            Brand Name: ${name}
            Website: ${website}
            Desired Tone: ${tone}

            Provide a JSON response with:
            1. name: The refined brand name.
            2. primaryColor: A HEX code that fits the brand.
            3. secondaryColor: A HEX code that complements the primary.
            4. refinedTone: A more descriptive tone (e.g. "Minimalist Tech-savvy").
            5. keyThemes: 3-5 keywords or themes for the brand.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for speed/cost, can be upgraded to gpt-4
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const analysis = JSON.parse(response.choices[0].message.content || '{}');

        return NextResponse.json({
            ...analysis,
            website,
            originalTone: tone,
        });

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze brand" }, { status: 500 });
    }
}
