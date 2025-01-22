import { Card } from "@/shadcn/components/ui/card"
import { School } from "lucide-react"
import { Head, useForm } from "@inertiajs/react"
import TeacherLayout from "@/Layouts/TeacherLayout"
import UpdateTeacherClass from "../Partials/Teacher/UpdateTeacherClass"
import { NotificationType, Notification } from "@/Components/Notification"
import { useState, useEffect } from "react"
interface NotificationData {
    id: number
    variant: NotificationType
    sender?: {
        name: string
        avatar: string
    }
    title?: string
    message: string
}

interface SessionMessages {
    add_success?: string | null
    update_success?: string | null
    delete_success?: string | null
    error?: string | null
}

interface Props {
    user: any
    messages: SessionMessages
    classrooms: Array<{
        id: number
        name: string
    }>
    currentClassroom: number
}

export default function TeacherEdit({
    user,
    messages,
    classrooms,
    currentClassroom,
}: Props) {

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

    const detailsForm = useForm({
        classroom_id: currentClassroom || 0,
    })

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        detailsForm.post(route('profile.teacher.details.update'), {
            preserveScroll: true,
        })
    }

    return (
        <TeacherLayout title="Teacher Details">
            <Head title="Teacher Details" />
            <div className="container py-6">
                <Card className="p-6 space-y-6 bg-emerald-50 border border-emerald-400">
                    <div>
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <School className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Teacher Details</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Update your class details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UpdateTeacherClass
                        form={detailsForm}
                        classrooms={classrooms}
                        onSubmit={handleDetailsSubmit}
                    />
                </Card>

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
            </div>

        </TeacherLayout>
    )
}
