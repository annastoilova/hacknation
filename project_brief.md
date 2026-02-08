# Project Brief: BrandSync AI - AI Social Media Agent

## 1. Executive Summary
**BrandSync AI** is an AI-powered social media companion designed to automate the creation of on-brand content for marketing teams, particularly for high-stakes events like hackathons, the Super Bowl, or the Olympics. It acts as a "junior social media manager + designer," generating post variations that align with a company's brand voice and visual identity while allowing for human oversight.

## 2. Core Objectives
-   **Automate Creation:** Generate high-quality LinkedIn and Instagram posts from simple intents.
-   **Enforce Consistency:** Maintain brand voice and visual identity across all content.
-   **Agentic Quality Control:** Implement self-feedback loops to critique and improve outputs before human review.
-   **Streamline Workflow:** Reduce the time from "idea" to "ready-to-post" to minutes.

## 3. Key Features

### A. Brand DNA Engine (Onboarding)
-   **Inputs:** Company URL, existing social handles, or manual description.
-   **AI Analysis:** Determine brand voice (e.g., "Professional & Direct" vs. "Playful & Emoji-heavy"), color palette, and key themes.
-   **Output:** A "Brand Profile" that guides all future generation.

### B. Campaign Architect (Planning)
-   **User Intent:** "Announce Hack-Nation winners with a Super Bowl reference."
-   **Parameters:** Platform (LinkedIn/IG), Tone (Excited/Formal), Key Elements (e.g., "Include trophy emoji").
-   **Scheduling:** Optional date/time suggestions.

### C. Content Studio (Generation)
-   **Variations:** Generate 3 distinct options per intent.
-   **Components:**
    -   **Caption:** Tailored to platform (hashtags for IG, professional hook for LinkedIn).
    -   **Visuals:** AI-generated background images or selected stock/brand assets.
    -   **Overlays:** Text overlays styled with brand fonts/colors.

### D. Agentic Review Loop (Self-Correction)
-   **Process:** The AI critiques its own drafts against the Brand Profile.
-   **Checklist:** "Is the logo visible?", "Is the tone consistent?", "Is the text legible?".
-   **Refinement:** Automatically regenerates if quality checks fail.

### E. Human-in-the-Loop Editor
-   **Selection:** User picks the best variation.
-   **Tweak:** Simple controls to "Apply more professional tone", "Make image brighter", or edit text directly.
-   **Final Polish:** One-click export or "Schedule".

## 4. Technical Stack
-   **Framework:** Next.js 14+ (App Router)
-   **Styling:** TailwindCSS (with a focus on "Rich Aesthetics" - dark mode, glassmorphism, smooth animations).
-   **AI Core:** Vercel AI SDK / OpenAI API (GPT-4 for text/logic, DALL-E 3 for images).
-   **State Management:** React Context or Zustand.
-   **Deployment:** Vercel (recommended).

## 5. Design Aesthetic
-   **Theme:** "Cyberpunk Professional" or "Modern SaaS" - clean lines, neon accents (aligning with a Hackathon vibe).
-   **UI/UX:** High-interactivity. Hover states, loading skeletons, and "magical" transitions when content is generating.

## 6. Implementation Stages
1.  **Project Setup:** Initialize Next.js project with Tailwind and essential UI components.
2.  **Brand Profile UI:** Create forms and extraction logic.
3.  **Generation Engine:** Connect to AI for text/image generation.
4.  **Review Interface:** Build the dashboard for viewing and editing posts.
5.  **Agentic Loop:** Implement the "Critique" step visually (show the AI "thinking").
