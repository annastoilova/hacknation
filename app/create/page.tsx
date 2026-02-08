import CampaignForm from '@/components/campaign/CampaignForm';

export default function CreatePage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-3xl mb-8 space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        ARCHITECT YOUR STORY
                    </h1>
                    <p className="text-gray-400 font-medium">Step 2: Tell us what you want to achieve today.</p>
                </div>

                <CampaignForm />
            </div>
        </main>
    );
}
