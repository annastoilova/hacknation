export interface ImageGenerationPrompt {
    subject: string;
    styleParams: string[];
    negativePrompt: string[];
    composition: string;
    lighting: string;
    texture: string;
}

export class CreatorAgent {
    private readonly forbiddenTerms = [
        "hyper-realistic", "masterpiece", "8k", "trending on artstation",
        "shiny", "smooth", "perfect", "3D render", "cinematic lighting",
        "epic", "unreal engine", "volumetric lighting", "intricate details",
        "airbrushed", "ethereal", "lens flare", "sparkling", "shimmering"
    ];

    private readonly mandatoryStyle = [
        "high-end lifestyle photography",
        "35mm lens",
        "realistic textures",
        "candid",
        "minimalist",
        "f/1.8 aperture"
    ];

    generateImagePrompt(brandProfile: any, concept: string): string {
        // base prompt construction
        const subject = concept;

        // 1. authentic lens
        const lighting = "natural lighting, soft window light, golden hour, overcast diffusion";
        const texture = "micro-imperfections, skin pores, fabric weave, slight film grain, natural shadows";

        // 2. color palette
        const colors = brandProfile.visuals?.primaryColor
            ? `muted tones, soft pastels, off-whites, deep shadows`
            : "muted colors";

        // 3. composition
        const composition = "rule of thirds, negative space for text, asymmetric composition, editorial style";

        // combine all elements
        let prompt = `${subject}. ${lighting}. ${texture}. ${composition}. ${colors}. `;

        // add mandatory style keywords
        prompt += this.mandatoryStyle.join(", ") + ". ";

        // add brand specific voice/style if any, but ensure it doesn't conflict
        if (brandProfile.visuals?.imageStyle) {
            prompt += `Style: ${brandProfile.visuals.imageStyle}. `;
        }

        // explicitly filter out forbidden terms from the *input* concept if present (basic sanitization)
        this.forbiddenTerms.forEach(term => {
            const regEx = new RegExp(`\\b${term}\\b`, "gi");
            prompt = prompt.replace(regEx, "");
        });

        // Add negative prompt instruction (for DALL-E 3 mainly via text, but good practice)
        prompt += ` --no ${this.forbiddenTerms.join(", ")}`;

        return prompt;
    }

    generateCopy(brandProfile: any, topic: string, platform: string): string {
        // "Human Rhythm" & "Lowercase" simulation
        // In a real LLM call, these would be system instructions. 
        // Here we simulate the output to demonstrate the guardrails using dynamic attributes.

        const voice = brandProfile.voiceSignature || { casing: 'lowercase', energy: 'calm' };

        const hooks = voice.energy === 'high' ? [
            "Start now.", "Push harder.", "No excuses.", "Go."
        ] : [
            "focus on the big picture.", "start building today.", "keep it simple.", "just ship it."
        ];

        const body = voice.energy === 'high' ? [
            "You have what it takes. The limit is only in your mind.",
            "Crush your goals today. Momentum is everything.",
            "Don't wait for permission. Take action.",
            "High performance is a choice. Make it."
        ] : [
            "we handle the details so you don't have to. it's about time automation felt natural.",
            "consistency is key, but not at the cost of your sanity. let the loop work for you.",
            "stop overthinking the process. just set the parameters and let it run.",
            "growth happens when you step back. efficient workflows make that possible."
        ];

        // Randomly select components
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        const main = body[Math.floor(Math.random() * body.length)];

        let copy = `${hook} ${main}`;

        // Platform specific adjustments
        if (platform === 'linkedin') {
            copy += "\n\n#efficiency #growth";
        }

        // 1. Dynamic Casing
        if (voice.casing === 'lowercase') {
            copy = copy.toLowerCase();
        } else if (voice.casing === 'sentence-case') {
            // Basic sentence casing conversion
            // Ensure first letter is capped
            copy = copy.charAt(0).toUpperCase() + copy.slice(1);
            // Cap after period
            copy = copy.replace(/(\. )([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
        }

        // 2. Emoji Constraint (Max 1, no forbidden ones)
        // We'll add one allowed emoji occasionally to demonstrate
        if (Math.random() > 0.5) {
            const allowedEmojis = ["✨", "👋", "👀", "💡"];
            const emoji = allowedEmojis[Math.floor(Math.random() * allowedEmojis.length)];
            copy += ` ${emoji}`;
        }

        return copy;
    }
}
