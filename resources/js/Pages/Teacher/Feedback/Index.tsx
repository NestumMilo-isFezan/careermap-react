import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { LayoutDashboard, Meh, MessageCircleDashed, Send, Trash2, Pencil, X, CornerDownRight } from "lucide-react";
import { Button } from "@/shadcn/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/components/ui/avatar";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/shadcn/lib/utils";
import { PaginatedData } from "@/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shadcn/components/ui/alert-dialog";
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shadcn/components/ui/dialog";

interface Feedback {
    id: number;
    feedback: string;
    created_at: string;
    student: {
        id: number;
        name: string;
        image: string;
    };
    reply?: {
        reaction: string;
        response: string;
    };
}

interface Student {
    id: number;
    name: string;
    image: string;
}

interface Props {
    feedbacks: PaginatedData<Feedback>;
    students: Array<Student>;
    selectedStudentId?: number;
    queryParams: any;
}

const getReactionEmoji = (reaction: string | null) => {
    const emojiMap: Record<string, string> = {
        like: '👍',
        anger: '😠',
        sad: '😢',
        happy: '😊',
        fear: '😨',
        surprise: '😮'
    };
    if(!reaction) return <Meh className="size-4" />;
    return emojiMap[reaction.toLowerCase()] || reaction;
};

export default function Index({ feedbacks, students, selectedStudentId, queryParams }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(selectedStudentId || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        student_id: selectedStudentId || '',
        feedback: '',
    });

    queryParams = queryParams ?? {};

    const searchFieldChanged = (field: string, value: string | number | null) => {
        if(value) {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        router.get(route('teacher.feedback.index'), queryParams, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleStudentSelect = (studentId: number) => {
        setSelectedStudent(studentId);
        setData('student_id', studentId);
        searchFieldChanged('student_id', studentId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('teacher.feedback.store'), {
            onSuccess: () => {
                reset('feedback');
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleEdit = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setData('feedback', feedback.feedback);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedFeedback(null);
        reset('feedback');
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFeedback) return;

        router.put(route('teacher.feedback.update', selectedFeedback.id), {
            feedback: data.feedback
        }, {
            onSuccess: () => {
                handleDialogClose();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDelete = (feedbackId: number, feedbackText: string) => {
        setItemToDelete(feedbackId);
        setItemName(feedbackText);
        setIsAlertOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete !== null) {
            router.delete(route('teacher.feedback.destroy', itemToDelete), {
                onSuccess: () => {
                    setIsAlertOpen(false);
                    setItemToDelete(null);
                    setItemName(null);
                },
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <TeacherLayout title="Feedback">
            <Head title="Feedback" />
            <div className="flex flex-col w-full">
                <div className="flex flex-col w-full h-full p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                            <div className="flex flex-row items-center gap-x-4">
                                <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                    <LayoutDashboard className="size-5 md:size-6 text-emerald-600" />
                                </span>
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Student Feedback</h1>
                                    <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                        Send and manage feedback for your students.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 h-[calc(100vh-8rem)]">
                        <div className="w-72 flex-shrink-0 bg-mint-50 rounded-lg border border-emerald-500 overflow-hidden flex flex-col">
                            <h2 className="p-4 font-semibold text-emerald-800 bg-yellow-100/50 border-b border-emerald-200">
                                Students
                            </h2>
                            <div className="p-2 space-y-1 overflow-y-auto bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] flex-1">
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        onClick={() => handleStudentSelect(student.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-md hover:bg-emerald-100/50 cursor-pointer",
                                            selectedStudent === student.id && "bg-emerald-500/70 hover:bg-emerald-800/50"
                                        )}
                                    >
                                        <Avatar className="size-8">
                                            <AvatarImage src={student.image} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-emerald-800">
                                            {student.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-lg border border-emerald-500 overflow-hidden">
                            <div className="flex-1 p-4 overflow-y-auto">
                                {queryParams.student_id && feedbacks && feedbacks.data.length > 0 ? (
                                    <div className="space-y-4">
                                        {feedbacks.data.map((feedback) => (
                                            <div key={feedback.id} className="bg-emerald-400/50 rounded-lg p-4 shadow-sm">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex flex-row items-center justify-between">
                                                            <span className="font-medium text-emerald-800">
                                                                You
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-emerald-600">
                                                                    {new Date(feedback.created_at).toLocaleDateString()}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8 text-emerald-700 hover:text-emerald-900"
                                                                    onClick={() => handleEdit(feedback)}
                                                                >
                                                                    <Pencil className="size-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8 text-red-600 hover:text-red-800"
                                                                    onClick={() => handleDelete(feedback.id, feedback.feedback)}
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row items-center gap-2">
                                                            <CornerDownRight className="size-4 text-emerald-700" />
                                                            <p className="mt-1 text-sm text-emerald-700">{feedback.feedback}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {feedback.reply ? (
                                                    <div className="flex flex-col mt-2 p-2 bg-yellow-100/50 rounded border border-emerald-500">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <Avatar className="size-8">
                                                            <AvatarImage src={feedback.student.image} />
                                                            <AvatarFallback>{feedback.student.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-xs font-bold text-emerald-600">{feedback.student.name}</p>
                                                    </div>
                                                        <div className="ml-10 mt-1 flex flex-row items-center justify-between gap-2">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <CornerDownRight className="size-4 text-emerald-700" />
                                                                <p className="text-xs text-emerald-600">{feedback.reply.response}</p>
                                                            </div>
                                                            <span className="text-xl text-gray-500">{getReactionEmoji(feedback.reply.reaction)}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col mt-2 p-2 bg-yellow-100/50 rounded border border-emerald-500">
                                                        <div className="ml-10 mt-1 flex flex-row items-center justify-between gap-2">
                                                            <p className="text-xs text-emerald-600">No reply yet</p>
                                                            <span className="text-xl text-gray-500">{getReactionEmoji(null)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-emerald-600">
                                        <MessageCircleDashed className="size-8 mb-2" />
                                        <p className="text-sm font-medium">
                                            {selectedStudent
                                                ? "No feedback yet for this student"
                                                : "Select a student to view or send feedback"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedStudent && (
                                <form onSubmit={handleSubmit} className="p-4 bg-yellow-100/50 border-t border-emerald-200">
                                    <Textarea
                                        value={data.feedback}
                                        onChange={(e) => setData('feedback', e.target.value)}
                                        placeholder="Write your feedback here..."
                                        className="min-h-[80px] mb-3 resize-none bg-transparent border-none focus-visible:ring-0 p-0 shadow-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing || !data.feedback}
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <Send className="size-4 mr-2" />
                                            Send Feedback
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DestructiveAlert
                isOpen={isAlertOpen}
                onOpenChange={setIsAlertOpen}
                onConfirm={handleDeleteConfirm}
                itemId={itemToDelete}
                name={itemName}
                withIcon={true}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) handleDialogClose();
            }}>
                <DialogContent className="max-w-lg bg-emerald-50">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-900">Edit Feedback</DialogTitle>
                        <DialogDescription className="text-slate-700">
                            Update your feedback message
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <Textarea
                            value={data.feedback}
                            onChange={(e) => setData('feedback', e.target.value)}
                            placeholder="Write your feedback here..."
                            className="min-h-[120px] resize-none bg-white border-emerald-200 focus-visible:ring-emerald-500"
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                onClick={handleDialogClose}
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                                <X className="size-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.feedback}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Pencil className="size-4 mr-2" />
                                Update Feedback
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </TeacherLayout>
    );
}
