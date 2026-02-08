import { BrandProfile, BrandAnalysisInput } from '@/src/types/brand';

export async function analyzeBrand(input: BrandAnalysisInput): Promise<BrandProfile> {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const isTech = input.url?.includes('tech') || input.description?.includes('AI') || true;
    return {
        name: "Lume Demo",
        voice: {
            tone: isTech ? "Innovative & Direct" : "Friendly & Warm",
            style: "Concise",
            keywords: ["Future", "Scale", "Automate"],
            emojis: true,
        },
        visuals: {
            primaryColor: isTech ? "#0F172A" : "#F43F5E",
            secondaryColor: "#3B82F6",
            fontStyle: "sans-serif",
            imageStyle: "Modern SaaS, Glassmorphism, Neon Accents"
        },
        values: ["Efficiency", "Quality", "User-Centric"],
        audience: "Tech-forward founders and marketing teams"
    };
}
