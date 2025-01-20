import { Card } from "@/shadcn/components/ui/card"
import { School } from "lucide-react"
import { Head, useForm } from "@inertiajs/react"
import TeacherLayout from "@/Layouts/TeacherLayout"
import UpdateTeacherClass from "../Partials/Teacher/UpdateTeacherClass"
import { NotificationType } from "@/Components/Notification"

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
}

export default function TeacherEdit({
    user,
    messages,
    classrooms,
}: Props) {
    const detailsForm = useForm({
        classroom_id: user.teacher?.classroom_id || 0,
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
            </div>
        </TeacherLayout>
    )
}
