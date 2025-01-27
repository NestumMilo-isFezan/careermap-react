import RoadmapIcon from '@/Components/Card/RoadmapIcon';
import StudentLayout from '@/Layouts/StudentLayout';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { PageProps, PaginatedData, Roadmap, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface News {
    title: string;
    description: string;
    image: string;
    created_at: string;
}

const slides = [
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

const Carousel = ({ news }: { news: News[] }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const autoplayIntervalTime = 4000;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setSlideDirection('left');
                setCurrentSlideIndex((prev) =>
                    prev === news.length - 1 ? 0 : prev + 1
                );
            }
        }, autoplayIntervalTime);

        return () => clearInterval(interval);
    }, [isPaused, news.length]);

    const previous = () => {
        setSlideDirection('right');
        setCurrentSlideIndex((prev) =>
            prev === 0 ? news.length - 1 : prev - 1
        );
    };

    const next = () => {
        setSlideDirection('left');
        setCurrentSlideIndex((prev) =>
            prev === news.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl">
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

                {news.map((newsItem, index) => (
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
                                {newsItem.title}
                            </h3>
                            <p className="lg:w-1/2 w-full text-pretty text-sm text-neutral-300">
                                {newsItem.description}
                            </p>
                        </div>
                        <img
                            className="absolute w-full h-full inset-0 object-cover text-neutral-600 dark:text-neutral-300 rounded-lg"
                            src={newsItem.image}
                            alt={newsItem.title}
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
                {news.map((_, index) => (
                    <button
                        key={index}
                        className={`size-2 cursor-pointer rounded-full transition ${
                            currentSlideIndex === index ? 'bg-neutral-300' : 'bg-neutral-300/50'
                        }`}
                        onClick={() => {
                            setSlideDirection(index > currentSlideIndex ? 'left' : 'right');
                            setCurrentSlideIndex(index);
                        }}
                        aria-label={`news ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const HomeRoadmapCard = ({ roadmap }: { roadmap: Roadmap }) => {
    const fixedDescription = roadmap.description.substring(0, 100) + '...';
    const maxHeight = 'h-34 md:h-48';
    const minHeight = 'min-h-44 md:min-h-64';
    return (
        <>
        <Card className="max-w-sm overflow-hidden group bg-yellow-50/50 text-neutral-600 border-emerald-500">
          <div className={`${maxHeight} overflow-hidden`}>
            <img
              src={roadmap.image}
              alt={roadmap.title}
              className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-1 font-medium">
              <RoadmapIcon domain={roadmap.domain_name} className="size-5" />
              <span>{roadmap.domain_name}</span>
            </div>
          </CardHeader>
          <CardContent className={`p-6 pt-4 pb-0`}>
            <h3 className="text-balance text-xl lg:text-2xl font-bold text-neutral-900 mb-4 line-clamp-2" aria-describedby="roadmapDescription">
              {roadmap.title}
            </h3>
            <p id="roadmapDescription" className="text-pretty text-sm mb-6">
              {fixedDescription}
            </p>
          </CardContent>
        </Card>
        </>
    );
};

interface HomeProps {
    recommendations: PaginatedData<Roadmap>
    user: User
    news: News[]
}

export default function Home({ recommendations, user, news }: HomeProps) {
    const [displayCount, setDisplayCount] = useState(4); // Default for mobile

    useEffect(() => {
        const handleResize = () => {
            // Use 3 items for desktop (lg screens), 4 for mobile
            setDisplayCount(window.innerWidth >= 1024 ? 3 : 4);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <StudentLayout>
            <Head title="Welcome" />
            <div className="flex flex-col items-center min-h-screen">
                <div className="absolute top-16 w-full md:px-4 mx-auto flex flex-col items-center bg-emerald-100">
                    <h1 className="text-2xl font-extrabold text-emerald-900">
                        Welcome,
                        <span className="text-emerald-500"> {user.name}</span>
                        <span className="text-emerald-500">✨</span>
                    </h1>
                </div>
                <div className="w-full md:px-4 mx-auto flex flex-col gap-4 pt-6">
                    <h1 className="text-3xl font-extrabold text-emerald-900 text-center">
                        NEWS
                    </h1>
                    <Carousel news={news} />
                </div>
                <div className="w-full md:px-4 mx-auto gap-4 pt-12">
                    <div className="w-full px-4 flex flex-col gap-4">
                        <h1 className="text-3xl font-extrabold text-emerald-900 text-center pt-2">
                            Roadmap Recommendations
                        </h1>
                        <div className="flex justify-end px-8">
                            <Link href={route('student.roadmap.index')} className={buttonVariants({ variant: 'default' })}>
                                View All
                            </Link>
                        </div>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 pb-8 mx-auto w-full md:max-w-screen-lg">
                            {recommendations && recommendations.data
                                .slice(0, displayCount)
                                .map((roadmap: Roadmap) => (
                                    <div key={roadmap.id}>
                                        <HomeRoadmapCard roadmap={roadmap} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
