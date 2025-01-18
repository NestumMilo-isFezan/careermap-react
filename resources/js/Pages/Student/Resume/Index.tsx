import StudentLayout from "@/Layouts/StudentLayout";
import { User } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { useEffect, useState } from "react";
import { NotificationData } from "@/Pages/Admin/Roadmap/Index";
import { Notification } from "@/Components/Notification";
interface Props {
    user: User;
    messages: {
        add_success: string;
        update_success: string;
        delete_success: string;
        error: string;
    };
}

export default function Index({ user, messages }: Props){
    // Notfication
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const displayDuration = 4000

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
    return (
        <StudentLayout>
            <Head title="Resume" />
            <section id="resume_hero" className="px-18 py-12 md:py-0 md:pt-16">
                <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center">
                    <div className="w-full md:max-w-screen-md">
                        <div className="w-full flex flex-col justify-center items-center">
                            <img
                                src="/assets/resume_guy.png"
                                alt="Resume Illustration"
                                className="h-1/2 md:h-[70%] object-contain"
                            />
                            <Link
                                href={route('student.resume.create')}
                                className={buttonVariants({ variant: 'default', size: 'lg', className: 'w-full max-w-xs' })}
                            >
                                Create Resume
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 pt-12 md:pt-0">
                        <div className="flex flex-col space-y-2 items-center md:items-start justify-center">
                            <p className="font-mono text-md font-bold text-sky-500">
                                {'>>'}
                                <span className="text-sky-500">  Create Your </span>
                                <span className="text-white bg-emerald-500/70 px-2 py-1 italic">Resume</span>
                            </p>
                            <div className="flex flex-col items-center justify-center font-cabinet font-extrabold text-6xl">
                                <span className="text-green-500">LIKE A</span>
                                <span className="text-green-500">BOSS...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="fixed inset-x-8 top-0 z-[99] flex max-w-full flex-col gap-2 bg-transparent px-6 py-6 md:bottom-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm">
                    {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        onDismiss={() => removeNotification(notification.id)}
                        displayDuration={displayDuration}
                    />
                    ))}
                </div>
        </StudentLayout>
    )
}
