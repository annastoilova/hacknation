export class CriticAgent {
    private readonly slopKeywords = [
        "hyper-realistic", "masterpiece", "8k", "trending on artstation",
        "shiny", "smooth", "perfect", "3D render", "cinematic lighting",
        "epic", "unreal engine", "volumetric lighting", "intricate details",
        "airbrushed", "ethereal", "lens flare", "sparkling", "shimmering",
        "neon glow", "cyberpunk"
    ];

    async critiqueDraft(prompt: string, imageUrl: string | undefined): Promise<{ accepted: boolean; feedback: string }> {
        // In a real scenario, this might use vision API to inspect the image.
        // For now, we audit the prompt text.

        let feedback = "";
        let accepted = true;


        let searchPrompt = prompt.toLowerCase();
        const negativePromptIndex = searchPrompt.indexOf("--no");
        if (negativePromptIndex !== -1) {
            searchPrompt = searchPrompt.substring(0, negativePromptIndex);
        }

        // "Slop Audit"
        const foundSlop = this.slopKeywords.filter(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(searchPrompt);
        });

        if (foundSlop.length > 0) {
            accepted = false;
            feedback += `Draft rejected: The output feels like 'AI Slop' due to terms like: ${foundSlop.join(", ")}. `;
        }

        if (!prompt.includes("35mm") && !prompt.includes("film grain")) {
            accepted = false;
            feedback += "Draft rejected: Missing 'Authentic Lens' constraints (35mm, film grain). ";
        }

        if (!prompt.includes("imperfections")) {
            accepted = false;
            feedback += "Draft rejected: Texture must include 'micro-imperfections'. ";
        }

        if (!accepted) {
            feedback += "Re-generate with 35mm film grain, muted saturation, and asymmetric composition. Focus on natural shadows and human imperfections to make it look authentic.";
        }

        return { accepted, feedback };
    }

    private readonly clicheBlacklist = [
        "revolutionize", "unleash", "game-changer", "dive in", "harness",
        "cutting-edge", "ultimate", "seamlessly", "robust", "transform"
    ];

    private readonly forbiddenEmojis = ["🚀", "🔥", "🧠"];

    async auditCopy(copy: string, brandProfile?: any): Promise<{ accepted: boolean; feedback: string }> {
        let feedback = "";
        let accepted = true;
        const lowercaseCopy = copy.toLowerCase();

        // 0. The "Mirror Test" (Dynamic Voice Checks)
        if (brandProfile && brandProfile.voiceSignature) {
            const voice = brandProfile.voiceSignature;

            // Vocabulary Check
            if (voice.buzzwordsToAvoid) {
                const foundBuzzwords = voice.buzzwordsToAvoid.filter((word: string) => lowercaseCopy.includes(word.toLowerCase()));
                if (foundBuzzwords.length > 0) {
                    accepted = false;
                    feedback += `Copy rejected: Uses forbidden buzzwords (${foundBuzzwords.join(", ")}). `;
                }
            }

            // Rhythm Check (simple word count heuristic)
            const wordCount = copy.split(" ").length;
            if (voice.sentenceLength === 'short' && wordCount > 20) {
                accepted = false;
                feedback += "Copy rejected: Too wordy for this brand's 'punchy' rhythm. Trim it down. ";
            }
        }

        // 1. Cliche Blacklist
        const foundCliches = this.clicheBlacklist.filter(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(lowercaseCopy);
        });

        if (foundCliches.length > 0) {
            accepted = false;
            feedback += `Copy rejected: Contains cliches (${foundCliches.join(", ")}). Use plain, powerful verbs instead. `;
        }

        // 2. Vibe Check: "Shouting" (All Caps)
        const upperCaseCount = copy.replace(/[^A-Z]/g, "").length;
        const totalLength = copy.replace(/[^a-zA-Z]/g, "").length;
        if (totalLength > 0 && (upperCaseCount / totalLength) > 0.5) {
            accepted = false;
            feedback += "Copy rejected: Too much shouting (all caps). Use sentence case or lowercase. ";
        }

        // 3. Emoji Constraint
        const emojiCount = (copy.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length;
        if (emojiCount > 1) {
            accepted = false;
            feedback += "Copy rejected: Too many emojis (max 1). ";
        }

        const foundForbiddenEmojis = this.forbiddenEmojis.filter(emoji => copy.includes(emoji));
        if (foundForbiddenEmojis.length > 0) {
            accepted = false;
            feedback += `Copy rejected: Forbidden emojis used (${foundForbiddenEmojis.join(" ")}). `;
        }

        // 4. "Bubbly" / "Salesy" check (simple heuristic)
        if (copy.includes("!") && (copy.match(/!/g) || []).length > 2) {
            accepted = false;
            feedback += "Copy rejected: Too 'bubbly' (excessive exclamation marks). Cool the tone down. ";
        }

        return { accepted, feedback };
    }
}
