import BrandOnboarding from '@/components/brand/BrandOnboarding';
import Header from '@/components/Header';

export default function OnboardingPage() {
    return (
        <div className="app-container min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <BrandOnboarding />
                </div>
            </div>
        </div>
    );
}

