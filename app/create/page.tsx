import CampaignForm from '@/components/campaign/CampaignForm';
import Header from '@/components/Header';

export default function CreatePage() {
    return (
        <main className="app-container min-h-screen flex flex-col">
            <Header />
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6">
                <div className="w-full max-w-3xl mb-8 space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                        ARCHITECT YOUR STORY
                    </h1>
                    <p className="text-slate-600 font-semibold text-lg">Step 2: Tell us what you want to achieve today.</p>
                </div>

                <div className="w-full max-w-3xl glass-effect p-8 rounded-[32px]">
                    <CampaignForm />
                </div>
            </div>
        </main>
    );
}

