import { useState } from "react"
import { CardTab } from "../Partials/Student/CardTab"
import UpdateStudentDetails from "../Partials/Student/UpdateStudentDetails"
import GradeForm from "../Partials/Student/UpdateStudentGrade"
import { Head, useForm } from "@inertiajs/react"
import { Card } from "@/shadcn/components/ui/card"
import StudentLayout from "@/Layouts/StudentLayout"
import { GraduationCap, School } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
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
    student: {
        school_id: number
        stream_id: number
        classroom_id: number
    } | null
    schools: any[]
    streams: any[]
    classrooms: any[]
    coreSubjects: any[]
    streamSubjects: any[]
    optionalSubjects: any[]
    selectedOptionalSubjects: any[]
    stream: string
    grades: any[]
    messages: SessionMessages
}

export default function StudentEdit({
    user,
    student,
    schools,
    streams,
    classrooms,
    coreSubjects,
    streamSubjects,
    optionalSubjects,
    selectedOptionalSubjects,
    stream,
    grades,
    messages,
}: Props) {
    const [activeTab, setActiveTab] = useState("profile")

    const detailsForm = useForm({
        school_id: student?.school_id || 0,
        stream_id: student?.stream_id || 0,
        classroom_id: student?.classroom_id || 0,
    })

    const gradesForm = useForm({
        grades: grades || [],
    })

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        detailsForm.post(route('profile.student.details.update'), {
            preserveScroll: true,
        })
    }

    const handleGradesSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        gradesForm.post(route('profile.student.grades.update'), {
            preserveScroll: true,
        })
    }

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <Card className="p-6 space-y-6 bg-emerald-50 border border-emerald-400">
                        <div>
                            <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 gap-4">
                                    <div className="flex flex-row items-center gap-x-4">
                                        <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                            <School className="size-5 md:size-6 text-emerald-600" />
                                        </span>
                                        <div className="flex flex-col">
                                            <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Student Details</h1>
                                            <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                                Update your academic information and personal details
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UpdateStudentDetails
                            form={detailsForm}
                            schools={schools}
                            streams={streams}
                            classrooms={classrooms}
                            queryParams={{}}
                            onSubmit={handleDetailsSubmit}
                        />
                    </Card>
                )
            case "grade":
                return (
                    <Card className="p-6 space-y-6 bg-emerald-50 border border-emerald-400">
                        <div>
                            <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 gap-4">
                                    <div className="flex flex-row items-center gap-x-4">
                                        <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                            <GraduationCap className="size-5 md:size-6 text-emerald-600" />
                                        </span>
                                        <div className="flex flex-col">
                                            <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Academic Grades</h1>
                                            <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                                View and manage your academic performance
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <GradeForm
                            form={gradesForm}
                            coreSubjects={coreSubjects}
                            streamSubjects={streamSubjects}
                            optionalSubjects={optionalSubjects}
                            selectedOptionalSubjects={selectedOptionalSubjects}
                            streamName={stream}
                            onSubmit={handleGradesSubmit}
                        />
                    </Card>
                )
            default:
                return null
        }
    }

    return (
        <StudentLayout>
            <Head title="Student Details" />
            <div className="container py-6">
                {/* Desktop View */}
                <div className="hidden md:flex gap-6">
                    <CardTab activeTab={activeTab} onTabChange={setActiveTab} />
                    <main className="flex-1">
                        {renderContent()}
                    </main>
                </div>

                {/* Mobile View */}
                <div className="flex flex-col md:hidden">
                    <div className="mb-4 px-4">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full bg-emerald-50 border-emerald-400">
                                <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="profile">
                                    <div className="flex items-center gap-2">
                                        <School className="h-4 w-4" />
                                        <span>Profile</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="grade">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Grade</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <main className="flex-1">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </StudentLayout>
    )
}
