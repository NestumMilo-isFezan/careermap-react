import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Wizard({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen font-sans text-gray-900 antialiased bg-yellow-50 md:px-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ">
            {children}
        </div>
    );
}
