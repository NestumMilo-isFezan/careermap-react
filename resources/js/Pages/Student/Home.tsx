import StudentLayout from '@/Layouts/StudentLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const slides = [
    {
        imgSrc: 'https://penguinui.s3.amazonaws.com/component-assets/carousel/default-slide-1.webp',
        imgAlt: 'Vibrant abstract painting with swirling blue and light pink hues on a canvas.',
        title: 'Front end developers',
        description: 'The architects of the digital world, constantly battling against their mortal enemy – browser compatibility.',
    },
    {
        imgSrc: 'https://penguinui.s3.amazonaws.com/component-assets/carousel/default-slide-2.webp',
        imgAlt: 'Vibrant abstract painting with swirling red, yellow, and pink hues on a canvas.',
        title: 'Back end developers',
        description: 'Because not all superheroes wear capes, some wear headphones and stare at terminal screens',
    },
    {
        imgSrc: 'https://penguinui.s3.amazonaws.com/component-assets/carousel/default-slide-3.webp',
        imgAlt: 'Vibrant abstract painting with swirling blue and purple hues on a canvas.',
        title: 'Full stack developers',
        description: 'Where "burnout" is just a fancy term for "Tuesday".',
    },
];

const Carousel = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const autoplayIntervalTime = 4000;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setSlideDirection('left');
                setCurrentSlideIndex((prev) =>
                    prev === slides.length - 1 ? 0 : prev + 1
                );
            }
        }, autoplayIntervalTime);

        return () => clearInterval(interval);
    }, [isPaused]);

    const previous = () => {
        setSlideDirection('right');
        setCurrentSlideIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const next = () => {
        setSlideDirection('left');
        setCurrentSlideIndex((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative min-h-[50svh] w-full">
                <button
                    onClick={previous}
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full transform transition-transform duration-500 ease-in-out
                            ${currentSlideIndex === index ? 'z-10' : 'z-0'}
                            ${
                                currentSlideIndex === index
                                    ? 'translate-x-0'
                                    : slideDirection === 'left'
                                    ? index > currentSlideIndex
                                        ? 'translate-x-full'
                                        : '-translate-x-full'
                                    : index > currentSlideIndex
                                        ? '-translate-x-full'
                                        : 'translate-x-full'
                            }
                        `}
                    >
                        <div className="lg:px-32 lg:py-14 absolute inset-0 z-10 flex flex-col items-center justify-end gap-2 bg-gradient-to-t from-neutral-950/85 to-transparent px-16 py-12 text-center">
                            <h3 className="w-full lg:w-[80%] text-balance text-2xl lg:text-3xl font-bold text-white">
                                {slide.title}
                            </h3>
                            <p className="lg:w-1/2 w-full text-pretty text-sm text-neutral-300">
                                {slide.description}
                            </p>
                        </div>
                        <img
                            className="absolute w-full h-full inset-0 object-cover text-neutral-600 dark:text-neutral-300"
                            src={slide.imgSrc}
                            alt={slide.imgAlt}
                        />
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="absolute bottom-5 right-5 z-20 rounded-full text-neutral-300 opacity-50 transition hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:outline-offset-0"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "play carousel" : "pause carousel"}
            >
                {isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-7">
                        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-7">
                        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            <div className="absolute rounded-md bottom-3 md:bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-4 md:gap-3 px-1.5 py-1 md:px-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`size-2 cursor-pointer rounded-full transition ${
                            currentSlideIndex === index ? 'bg-neutral-300' : 'bg-neutral-300/50'
                        }`}
                        onClick={() => {
                            setSlideDirection(index > currentSlideIndex ? 'left' : 'right');
                            setCurrentSlideIndex(index);
                        }}
                        aria-label={`slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function Home({ auth }: PageProps) {
    const user = usePage().props.auth.user;

    return (
        <StudentLayout>
            <Head title="Welcome" />
            <div className="flex flex-col gap-4 items-center min-h-screen">
                <h1 className="text-2xl font-extrabold text-emerald-900">
                    Welcome,
                    <span className="text-emerald-500"> {user.name}</span>
                    <span className="text-emerald-500">✨</span>
                </h1>
                <Carousel />
            </div>
        </StudentLayout>
    );
}
