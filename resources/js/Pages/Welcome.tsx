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
        secondary: "text-gray-500 rounded-full hover:bg-lime-200 hover:text-green-800 hover:underline"
    };

    return (
        <a
            href={href}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {variant === 'primary' ? (
                <span className="flex items-center">
                    Progress Now
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

            <section id="home_hero" className="px-2 py-12">
                <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
                    <div className="flex flex-wrap items-center sm:-mx-3">
                        <div className="w-full md:w-1/2 md:px-3">
                            <div className="w-full pb-6 md:ms-7 space-y-2 sm:max-w-md lg:max-w-lg sm:pr-5 lg:pr-0 md:pb-0">
                                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                                    {'>'} Plan Your Future Carefully with
                                </p>
                                <h1 className="text-4xl font-cabinet font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                                    <span className="block xl:inline bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text text-transparent">CAREER</span>
                                    <br />
                                    <span className="block xl:inline bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text text-transparent">MAP</span>
                                </h1>
                                <div className="relative flex flex-col sm:flex-row sm:space-x-4 mt-3">
                                    <HeroButton href="#_" variant="primary">
                                        Progress Now
                                    </HeroButton>
                                    <HeroButton href="#_" variant="secondary">
                                        Watch News
                                    </HeroButton>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="w-full h-auto overflow-hidden flex flex-row justify-center">
                                <img
                                    src="/assets/home_img.png"
                                    alt="Career Map Illustration"
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </WebLayout>
    );
}
