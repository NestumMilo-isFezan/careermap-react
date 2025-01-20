import StudentLayout from '@/Layouts/StudentLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from '../Partials/UpdatePasswordForm';
import DeleteUserForm from '../Partials/DeleteUserForm';
import UserInfoEdit from '../Partials/UserInfoEdit';
import { Notification, NotificationType, } from '@/Components/Notification';
import { useEffect, useState } from 'react';

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

export default function Edit({
    mustVerifyEmail,
    status,
    user,
    messages,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; user: any; messages: SessionMessages }>) {
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
            <Head title="Edit Profile" />
            <div className="py-4">
                <div className="mx-auto w-full space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-emerald-50 p-4 border border-emerald-500 sm:rounded-lg sm:pb-10">
                        <UserInfoEdit
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>
            </div>

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
    );
}
