import { AdminDashboardProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
    LayoutDashboard,
    Users,
    LogIn,
    UserPlus,
    Beaker,
    GraduationCap,
    MapPin,
    MapPinCheck
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsCardProps {
    title: string;
    metrics: {
        label: string;
        value: number | string;
        icon: React.ReactNode;
        color?: string;
    }[];
    chartData?: {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
            borderColor?: string[];
            borderWidth?: number;
        }[];
    };
}

const StatsCard = ({ title, metrics, chartData }: StatsCardProps) => {
    // Check if all data values are zero
    const hasData = chartData?.datasets[0]?.data.some(value => value > 0);

    return (
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-500/50 hover:shadow-md hover:shadow-green-400/20 transition-shadow">
            <div className="flex flex-col h-full">
                <h3 className="text-base font-semibold text-emerald-800 mb-3">{title}</h3>

                {/* Chart Section */}
                <div className="mb-4 h-48">
                    {chartData && hasData ? (
                        <Doughnut
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            boxWidth: 12,
                                            padding: 8,
                                        }
                                    },
                                    tooltip: {
                                        enabled: true
                                    },
                                    datalabels: {
                                        display: false
                                    }
                                },
                                cutout: '40%'
                            }}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center flex-col">
                            <svg
                                className="w-12 h-12 text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p className="text-gray-400 text-sm">No data available</p>
                        </div>
                    )}
                </div>

                {/* Metrics Section */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex flex-col">
                            <span className={`text-md ${metric.color || 'text-emerald-500 font-semibold'}`}>
                                {metric.label}
                            </span>
                            <div className="flex flex-row items-center gap-x-2">
                                {metric.icon}
                                <p className="text-2xl font-bold text-emerald-800">
                                    {metric.value || '0'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    loginCount,
    registerCount,
    scienceStream,
    nonScienceStream,
    totalRoadmaps,
    completedTests = 432,
}: AdminDashboardProps) {
    const greeting = () => {
        const hour = new Date().getHours();
        const time = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        let message = "";
        if(hour >= 5 && hour < 12) message = "Have a great morning!";
        else if(hour >= 12 && hour < 17) message = "Have a productive afternoon!";
        else if(hour >= 17 && hour < 22) message = "Have a peaceful evening!";
        else message = "Have a good night!";

        return { time, message };
    };

    const { time, message } = greeting();

    const statsGridSection = (
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            <StatsCard
                title="User Activity"
                metrics={[
                    {
                        label: "Login",
                        value: loginCount,
                        icon: <LogIn className="size-5 md:size-6 text-emerald-600" />
                    },
                    {
                        label: "Register",
                        value: registerCount,
                        icon: <UserPlus className="size-5 md:size-6 text-emerald-600" />
                    }
                ]}
                chartData={{
                    labels: ['Login', 'Register'],
                    datasets: [{
                        data: [loginCount, registerCount],
                        backgroundColor: ['#10B981', '#34D399'],
                        borderWidth: 0,
                    }]
                }}
            />

            <StatsCard
                title="Student Stream Distribution"
                metrics={[
                    {
                        label: "Science",
                        value: scienceStream,
                        icon: <Beaker className="size-5 md:size-6 text-emerald-600" />
                    },
                    {
                        label: "Non-Science",
                        value: nonScienceStream,
                        icon: <GraduationCap className="size-5 md:size-6 text-emerald-600" />
                    }
                ]}
                chartData={{
                    labels: ['Science', 'Non-Science'],
                    datasets: [{
                        data: [scienceStream, nonScienceStream],
                        backgroundColor: ['#3B82F6', '#60A5FA'],
                        borderWidth: 0,
                    }]
                }}
            />

            <StatsCard
                title="Roadmaps"
                metrics={[
                    {
                        label: "Total",
                        value: totalRoadmaps,
                        icon: <MapPin className="size-5 md:size-6 text-emerald-600" />
                    },
                    {
                        label: "Favourite",
                        value: 5,
                        icon: <MapPinCheck className="size-5 md:size-6 text-emerald-600" />
                    }
                ]}
                chartData={{
                    labels: ['Total', 'Favourite'],
                    datasets: [{
                        data: [totalRoadmaps, 5],
                        backgroundColor: ['#8B5CF6', '#A78BFA'],
                        borderWidth: 0,
                    }]
                }}
            />
        </div>
    );

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 pb-8 gap-4">
                    <div className="flex flex-row items-center gap-x-4">
                        <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                            <LayoutDashboard className="size-5 md:size-6 text-emerald-600" />
                        </span>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Dashboard Overview</h1>
                            <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                View system overview and statistics here.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Top Row */}
                <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                    {/* Welcome Card */}
                    <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 hover:shadow-md hover:shadow-green-400/20 transition-shadow">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-white opacity-10"></div>

                        <div className="relative">
                            <span className="inline-block px-3 py-1 mb-3 text-sm font-medium text-emerald-800 bg-white/30 backdrop-blur-sm rounded-full">
                                Dashboard Overview
                            </span>
                            <h2 className="text-xl font-semibold text-white/90">Welcome Back,</h2>
                            <h1 className="text-3xl font-bold text-white mt-1">Admin</h1>
                            <p className="mt-2 text-white/80">
                                {time} - {message}
                            </p>
                        </div>
                    </div>

                    {/* Total Users Card */}
                    <div className="p-6 bg-emerald-50 rounded-xl shadow-sm border border-emerald-500/50 hover:shadow-md hover:shadow-green-400/20 transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-gray-800">Total Users</h2>
                        </div>
                        <p className="text-4xl font-bold text-gray-800 mb-2">{totalUsers}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Students: {totalStudents}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">Teachers: {totalTeachers}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-600">Admins: {totalAdmins}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {statsGridSection}
            </div>
        </AdminLayout>
    );
}
