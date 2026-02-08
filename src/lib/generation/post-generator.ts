import { BrandProfile, CampaignIntent, GeneratedPost } from '@/src/types/brand';
import { CreatorAgent } from '@/src/lib/agents/creator-agent';
import { CriticAgent } from '@/src/lib/agents/critic-agent';

export async function generatePosts(brandProfile: BrandProfile, intent: CampaignIntent): Promise<GeneratedPost[]> {
    const creator = new CreatorAgent();
    const critic = new CriticAgent();
    const variations: GeneratedPost[] = [];

    // Simulate agentic thought process delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    for (const platform of intent.platforms) {
        // 1. Creator generates initial prompt concept
        const baseConcept = `${intent.topic} for ${platform}. ${intent.toneModifier}`;
        let imagePrompt = creator.generateImagePrompt(brandProfile, baseConcept);

        // 2. Critic audits the prompt
        let critique = await critic.critiqueDraft(imagePrompt, undefined);
        let retries = 0;

        while (!critique.accepted && retries < 2) {
            // Feedback loop: Creator refines prompt based on feedback
            // In a real LLM loop, we'd feed the feedback back to the prompt generator. 
            // Here we simulate the correction by appending the missing constraints if not present.
            // The CreatorAgent already does a good job, so this is a safety net.

            if (critique.feedback.includes("35mm")) {
                imagePrompt += " Shot on 35mm lens, film grain. ";
            }
            if (critique.feedback.includes("imperfections")) {
                imagePrompt += " Micro-imperfections, natural texture. ";
            }

            // Re-evaluate
            critique = await critic.critiqueDraft(imagePrompt, undefined);
            retries++;
        }

        // 3. Creator generates copy draft
        let copyDraft = creator.generateCopy(brandProfile, intent.topic, platform);

        // 4. Critic audits the copy
        let copyCritique = await critic.auditCopy(copyDraft);
        retries = 0;

        while (!copyCritique.accepted && retries < 2) {
            // Feedback loop for copy (simplified simulation)
            // In real LLM, we'd pass feedback. Here we just re-roll or strip cliches.
            if (copyCritique.feedback.includes("cliches")) {
                // Simple retry with a fresh roll usually fixes random cliches in our sim
                copyDraft = creator.generateCopy(brandProfile, intent.topic, platform);
            }
            if (copyCritique.feedback.includes("shouting")) {
                copyDraft = copyDraft.toLowerCase();
            }

            copyCritique = await critic.auditCopy(copyDraft);
            retries++;
        }

        // 5. Generate Post Object
        variations.push({
            id: `${platform}-${Date.now()}`,
            platform,
            caption: copyDraft,
            // In a real app, this prompt would go to DALL-E 3. 
            // We'll store the prompt in the imageUrl field for inspection or use a placeholder if needed.
            imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop&prompt=${encodeURIComponent(imagePrompt)}`,
            status: (critique.accepted && copyCritique.accepted) ? 'ready' : 'refining',
            feedback: `${critique.accepted ? "" : critique.feedback} ${copyCritique.accepted ? "" : copyCritique.feedback}`.trim() || "Approved by Critic Agent"
        });
    }

    return variations;
}
