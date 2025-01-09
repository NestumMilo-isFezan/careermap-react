import { Head } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';

export default function WizardIndex() {
    return (
        <WizardLayout>
            <Head title="Student Registration" />
            <div className="w-full py-4 text-center bg-emerald-50 border-b border-emerald-500 z-10 sticky top-0">
                <div className="inline-block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Let's Create Your Student Profile!
                    </h1>
                </div>
            </div>

            <div className="px-8 py-4">
                <div className="max-w-4xl mx-auto px-8 py-4 bg-green-50 border border-emerald-300 rounded-md shadow-sm">
                    <h2 className="text-lg font-bold">
                        Student Profile
                    </h2>
                </div>
            </div>
        </WizardLayout>
    );
}
