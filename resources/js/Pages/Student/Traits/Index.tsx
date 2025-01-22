import StudentLayout from '@/Layouts/StudentLayout';
import { Deferred, Head, Link, router } from '@inertiajs/react';
import { Info, ClipboardCheck, Brain } from 'lucide-react';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { Notification, NotificationType } from '@/Components/Notification';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Radar, Pie } from 'react-chartjs-2';
import { PaginatedData, Roadmap } from '@/types';
import RoadmapItem from '@/Components/Card/RoadmapItem';
import DisplayModal from '../Roadmap/Content/DisplayModal';
import { Dialog, DialogTrigger } from '@/shadcn/components/ui/dialog';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog"
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { RatingModal } from '@/Components/shadcn/RatingModal';

interface IndexProps {
    personaScoreExisted: boolean;
    messages: SessionMessages;
    personaScores: Array<PersonaScore>;
    suggestedRoadmaps: PaginatedData<Roadmap>;
}

interface PersonaScore {
    persona_id: number;
    persona_name: string;
    score: number;
}

export interface NotificationData {
    id: number
    variant: NotificationType
    sender?: {
      name: string
      avatar: string
    }
    title?: string
    message: string
}

export interface SessionMessages {
    add_success?: string | null
    update_success?: string | null
    delete_success?: string | null
    error?: string | null
}

// Register ChartJS components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels
);

export default function Index({ personaScoreExisted, messages, personaScores, suggestedRoadmaps }: IndexProps) {
    // Notfication
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const displayDuration = 4000
    const [isMobile, setIsMobile] = useState(false);
    const [highest, setHighest] = useState(10);
    const addNotification = (notification: Omit<NotificationData, 'id'>) => {
        const id = Date.now()
        const newNotification = { ...notification, id }

        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications, newNotification]
            if (updatedNotifications.length > 20) {
            updatedNotifications.splice(0, updatedNotifications.length - 20)
            }
            return updatedNotifications
        })

        // Play sound effect (if needed)
        // const notificationSound = new Audio('path/to/sound.mp3')
        // notificationSound.play().catch(error => console.error('Error playing sound:', error))
    }

    const removeNotification = (id: number) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        )
    }

    useEffect(() => {
        if (messages.add_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.add_success
            });
        }
        if (messages.update_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.update_success
            });
        }
        if (messages.delete_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.delete_success
            });
        }
        if (messages.error) {
            addNotification({
                variant: 'danger',
                title: 'Error',
                message: messages.error
            });
        }
    }, [messages]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const viewRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
    }

    useEffect(() => {
        if (personaScores){
            const highestScore = personaScores.reduce((max, score) => Math.max(max, score.score), 0);
            setHighest(highestScore);
        }
    }, [personaScores]);

    const handleCloseDialog = () => {
        setSelectedRoadmap(null);
    }

    const retakeButton = (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="underline text-emerald-500 hover:text-emerald-900 text-sm">
                    Do you want to retake the assessment?
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-rose-100 border border-rose-500 rounded-lg text-rose-900">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-rose-600">
                        This action will delete your current assessment results. You will need to complete the assessment again to get new results.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 border border-rose-500 rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => router.delete(route('student.traits.destroy'))}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    // Add this function near the other utility functions
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <StudentLayout>
            <Head title="Traits" />
            <Dialog open={selectedRoadmap !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
                <div className="flex flex-col w-full gap-4 p-0 md:p-4">
                    {/* Hero Section */}
                    <Card className="w-full bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CardContent className="py-4 px-4">
                            {personaScoreExisted ? (
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                                        <div className="flex flex-row gap-x-4 items-start py-2 w-full">
                                            <span className="inline-block p-3 bg-emerald-100 rounded-md border border-emerald-200 shrink-0">
                                                <Brain className="size-6 text-emerald-600" />
                                            </span>
                                            <div className="flex flex-col flex-1">
                                                <h1 className="text-xl font-bold text-emerald-950">
                                                    Career Traits Assessment
                                                </h1>
                                                <p className="text-emerald-700 text-sm text-justify">
                                                    Unlock your potential by understanding your personality traits
                                                    and discover career paths that align with who you are.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full border border-emerald-200 rounded-lg p-4">
                                        <div className="flex flex-row gap-x-4 items-start">
                                            <ClipboardCheck className="size-8 text-emerald-600 shrink-0" />
                                            <div className="w-full space-y-2">
                                                <h3 className="font-medium text-emerald-950 text-sm">
                                                    Assessment Completed
                                                </h3>
                                                <p className="text-xs text-emerald-700">
                                                    You've successfully completed the personality assessment.
                                                    View your results to explore career recommendations based on your traits.
                                                </p>
                                                <div className="flex flex-col gap-2 justify-start items-start">
                                                    {retakeButton}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 items-center max-w-3xl mx-auto text-center space-y-4 py-8">
                                    <div className="inline-block p-3 bg-emerald-100 rounded-full">
                                        <Brain className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-3xl font-bold text-emerald-950">
                                            Career Traits Assessment
                                        </h1>
                                        <p className="text-emerald-700 text-lg">
                                            Unlock your potential by understanding your personality traits
                                            and discover career paths that align with who you are.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status Card */}
                    <Card className="w-full border-emerald-200 bg-emerald-50">
                        <CardHeader className="pb-3 px-4">
                            <h2 className="text-xl font-semibold text-emerald-950">
                                Assessment Status
                            </h2>
                        </CardHeader>
                        <CardContent className="p-4">
                            {personaScoreExisted ? (
                                <Deferred data={['personaScores', 'suggestedRoadmaps']} fallback={<p>Loading...</p>}>
                                    <div className="w-full space-y-4">
                                        {/* Scores and Chart Container */}
                                        <div className="grid grid-cols-1 lg:flex lg:flex-row gap-4">
                                            {/* Scores List */}
                                            <div className="w-full lg:w-1/3 border border-emerald-200 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-emerald-950 mb-4">
                                                    Your Trait Scores
                                                </h3>
                                                <div className="grid grid-cols-1 gap-1 md:gap-4 overflow-y-auto max-h-[200px] custom-scrollbar">
                                                    {personaScores && personaScores.map((score: PersonaScore) => (
                                                        <div
                                                            key={score.persona_id}
                                                            className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                                                        >
                                                            <span className="text-sm font-medium text-emerald-700">
                                                                {score.persona_name}
                                                            </span>
                                                            <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                                                                {score.score}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Radar Chart */}
                                            <div className="w-full lg:w-2/3 border border-emerald-200 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-emerald-950 mb-4">
                                                    Personality Traits Visualization
                                                </h3>
                                                <div className="w-full h-[300px] md:h-[400px] relative">
                                                    {isMobile ? (
                                                        <Pie
                                                            data={{
                                                                labels: personaScores ? personaScores.map(score => score.persona_name) : [],
                                                                datasets: [
                                                                    {
                                                                        data: personaScores ? personaScores.map(score => score.score) : [],
                                                                        backgroundColor: [
                                                                            'rgba(16, 185, 129, 0.7)',
                                                                            'rgba(14, 165, 233, 0.7)',
                                                                            'rgba(168, 85, 247, 0.7)',
                                                                            'rgba(249, 115, 22, 0.7)',
                                                                            'rgba(236, 72, 153, 0.7)',
                                                                            'rgba(234, 179, 8, 0.7)',
                                                                        ],
                                                                        borderColor: [
                                                                            'rgb(16, 185, 129)',
                                                                            'rgb(14, 165, 233)',
                                                                            'rgb(168, 85, 247)',
                                                                            'rgb(249, 115, 22)',
                                                                            'rgb(236, 72, 153)',
                                                                            'rgb(234, 179, 8)',
                                                                        ],
                                                                        borderWidth: 1,
                                                                    },
                                                                ],
                                                            }}
                                                            options={{
                                                                responsive: true,
                                                                maintainAspectRatio: false,
                                                                plugins: {
                                                                    legend: {
                                                                        display: true,
                                                                        position: 'bottom' as const,
                                                                        labels: {
                                                                            color: 'rgb(15, 118, 110)',
                                                                            font: {
                                                                                size: 12,
                                                                                weight: 'normal',
                                                                            }
                                                                        }
                                                                    },
                                                                    tooltip: {
                                                                        callbacks: {
                                                                            label: function(context) {
                                                                                const value = context.dataset.data[context.dataIndex];
                                                                                return `${context.label}: ${value}`;
                                                                            }
                                                                        }
                                                                    },
                                                                    datalabels: {
                                                                        display: true,
                                                                        color: '#fff',
                                                                        font: {
                                                                            weight: 'bold',
                                                                            size: 12,
                                                                        },
                                                                        formatter: (value: number) => {
                                                                            return `${value}`;
                                                                        },
                                                                    }
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <Radar
                                                            data={{
                                                                labels: personaScores ? personaScores.map(score => score.persona_name) : [],
                                                                datasets: [
                                                                    {
                                                                        label: 'Your Personality Traits',
                                                                        data: personaScores ? personaScores.map(score => score.score) : [],
                                                                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                                                        borderColor: 'rgb(16, 185, 129)',
                                                                        borderWidth: 2,
                                                                        pointBackgroundColor: 'rgb(16, 185, 129)',
                                                                        pointBorderColor: '#fff',
                                                                        pointHoverBackgroundColor: '#fff',
                                                                        pointHoverBorderColor: 'rgb(16, 185, 129)',
                                                                    },
                                                                ],
                                                            }}
                                                            options={{
                                                                responsive: true,
                                                                maintainAspectRatio: false,
                                                                scales: {
                                                                    r: {
                                                                        beginAtZero: true,
                                                                        max: highest ? highest : 10,
                                                                        ticks: {
                                                                            stepSize: 2,
                                                                            display: true,
                                                                            color: 'rgb(15, 118, 110)',
                                                                            font: {
                                                                                size: 12,
                                                                                weight: 'normal'
                                                                            }
                                                                        },
                                                                        grid: {
                                                                            color: 'rgba(16, 185, 129, 0.1)',
                                                                        },
                                                                        angleLines: {
                                                                            color: 'rgba(16, 185, 129, 0.1)',
                                                                        },
                                                                        pointLabels: {
                                                                            font: {
                                                                                size: 14,
                                                                                weight: 'normal'
                                                                            },
                                                                            color: 'rgb(15, 118, 110)',
                                                                        },
                                                                    },
                                                                },
                                                                plugins: {
                                                                    legend: {
                                                                        position: 'bottom' as const,
                                                                        labels: {
                                                                            color: 'rgb(15, 118, 110)',
                                                                            font: {
                                                                                size: 14,
                                                                                weight: 'normal'
                                                                            },
                                                                            usePointStyle: true,
                                                                            padding: 20,
                                                                        },
                                                                    },
                                                                    tooltip: {
                                                                        backgroundColor: 'rgba(15, 118, 110, 0.8)',
                                                                        titleFont: {
                                                                            size: 14,
                                                                            weight: 'normal'
                                                                        },
                                                                        bodyFont: {
                                                                            size: 13
                                                                        },
                                                                        padding: 12
                                                                    }
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Suggested Roadmap Section */}
                                        <div className="w-full border border-emerald-200 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-emerald-950 mb-4">
                                                Suggested Roadmap
                                            </h3>
                                            <div className="w-full bg-yellow-50/50 border border-emerald-200 rounded-lg p-4">
                                                {suggestedRoadmaps && suggestedRoadmaps.data.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {suggestedRoadmaps.data.map((roadmap: Roadmap) => (
                                                            <DialogTrigger
                                                                key={roadmap.id}
                                                                asChild
                                                            >
                                                                <div className="w-full h-full cursor-pointer transition-transform hover:scale-[1.02]">
                                                                    <RoadmapItem roadmap={roadmap} />
                                                                </div>
                                                            </DialogTrigger>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-8 text-emerald-600">
                                                        <Info className="w-12 h-12 mb-2 opacity-50" />
                                                        <p className="text-center text-sm">No suggested roadmaps found.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Deferred>
                            ) : (
                                <div className="flex items-start gap-3 p-4 rounded-lg">
                                    <Info className="w-6 h-6 text-emerald-600 mt-0.5" />
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-emerald-950">
                                            Assessment Pending
                                        </h3>
                                        <p className="text-sm text-emerald-700 text-justify">
                                            Take your time to complete the comprehensive personality assessment to receive
                                            personalized career recommendations that match your unique traits.
                                        </p>
                                        <Link href={route('student.traits.create')} className={buttonVariants({ variant: 'default' })}>
                                                Start Assessment
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <div className="fixed bottom-4 right-4 z-[99] flex max-w-full flex-col gap-2 md:max-w-sm">
                        {notifications.map(notification => (
                        <Notification
                            key={notification.id}
                            {...notification}
                            onDismiss={() => removeNotification(notification.id)}
                            displayDuration={displayDuration}
                        />
                        ))}
                    </div>
                </div>

                {/* Dialog Content */}
                <DialogContent className="max-w-[95vw] h-[95vh] p-2 md:p-4 bg-emerald-50">
                    <DialogHeader className="p-2">
                        <DialogTitle className="text-emerald-900">Suggested Roadmap</DialogTitle>
                        <DialogDescription className="text-slate-700">
                            View roadmap details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-emerald-200 border border-primary rounded-lg">
                        <div className="p-2 md:p-4 h-[75vh] flex flex-row">
                                <DisplayModal id={selectedRoadmap?.id.toString() ?? ''} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </StudentLayout>
    );
}
