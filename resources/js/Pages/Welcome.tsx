import { PageProps } from '@/types';
import WebLayout from '@/Layouts/WebLayout';
import { Head } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

interface HeroButtonProps {
    href: string;
    variant: 'primary' | 'secondary';
    children: React.ReactNode;
}

const ArrowIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 ml-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

const IconSwitch = () => (
    <span className="ml-1 relative">
        <span className="block group-hover:hidden">
            <Sparkles size={20} className="ms-1" />
        </span>
        <span className="hidden group-hover:block">
            <ArrowIcon />
        </span>
    </span>
);

const HeroButton = ({ href, variant, children }: HeroButtonProps) => {
    const baseClasses = "group flex items-center px-6 py-3 relative overflow-hidden";
    const variantClasses = {
        primary: `w-full text-lg text-white bg-green-400 rounded-full sm:mb-0 hover:bg-green-400
                 sm:w-auto mb-3 transition-all duration-300 ease-out
                 before:absolute before:w-0 before:h-full
                 before:bg-gradient-to-r before:from-green-600 before:via-green-500 before:to-green-400
                 before:left-0 before:top-0
                 before:transition-all before:duration-500 before:ease-out
                 before:-skew-x-12
                 hover:before:w-[150%]
                 [&>span]:relative [&>span]:z-10`,
        secondary: "text-emerald-900 rounded-full hover:bg-lime-200 hover:text-emerald-900 hover:underline"
    };

    return (
        <a
            href={href}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {variant === 'primary' ? (
                <span className="flex items-center">
                    {children}
                    <IconSwitch />
                </span>
            ) : (
                children
            )}
        </a>
    );
};

export default function Welcome({ auth }: PageProps) {
    return (
        <WebLayout>
            <Head title="Home - CareerMap" />


            <section id="resume_hero" className="px-18 py-12 md:py-0 md:pt-16">
                <div className="w-full flex flex-col lg:flex-row items-center justify-center">
                    <div className="w-full md:max-w-screen-sm">
                        <div className="w-full flex flex-col justify-center items-center">
                            <img
                                src="/assets/home_img.png"
                                alt="Career Map Illustration"
                                className="h-1/3 lg:h-[70%] object-contain"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 pt-12 md:pt-0">
                        <div className="flex flex-col space-y-2 items-center md:items-start justify-center">
                            <p className="font-mono text-md lg:text-lg font-bold text-sky-500">
                                {'>>'}
                                <span className="text-sky-500">  Plan Your </span>
                                <span className="text-white bg-emerald-500/70 px-0 lg:px-2 py-1 italic">Future</span>
                                <span className="text-sky-500 hidden xl:inline">  Carefully </span>
                                <span className="text-sky-500">  with... </span>
                            </p>
                            <div className="flex flex-col items-center justify-center font-cabinet font-extrabold text-6xl">
                                <div className="flex flex-col">
                                    <span className="text-green-500">CAREER</span>
                                    <span className="text-green-500">MAP</span>
                                </div>
                            </div>
                            <div className="relative flex flex-col lg:flex-row gap-2 lg:gap-4 pt-8">
                                    <HeroButton href="#_" variant="primary">
                                        <span>Let's Start</span>
                                    </HeroButton>
                                    <HeroButton href="#_" variant="secondary">
                                        Watch News
                                    </HeroButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </WebLayout>
    );
}
