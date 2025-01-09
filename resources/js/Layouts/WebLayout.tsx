import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Navbar from '@/Components/Navbar';

export default function Web({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col flex-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <Navbar />
            <div className="px-6 py-6">
                {children}
            </div>
        </div>
    );
}
