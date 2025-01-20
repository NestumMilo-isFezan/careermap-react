import StudentLayout from "@/Layouts/StudentLayout";
import { Head, useForm } from "@inertiajs/react";
import { LayoutDashboard, MessageCircleDashed, Send, Pencil } from "lucide-react";
import { Button } from "@/shadcn/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/components/ui/avatar";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/shadcn/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";
import { PaginatedData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import { Label } from "@/shadcn/components/ui/label";

interface Feedback {
    id: number;
    feedback: string;
    created_at: string;
    teacher: {
        id: number;
        name: string;
        image: string;
    };
    reply?: {
        reaction: string;
        response: string;
    };
}

interface Props {
    feedbacks: PaginatedData<Feedback>;
}

const reactions = [
    { value: 'like', label: '👍', color: 'text-blue-500' },
    { value: 'happy', label: '😊', color: 'text-yellow-500' },
    { value: 'sad', label: '😢', color: 'text-indigo-500' },
    { value: 'anger', label: '😠', color: 'text-red-500' },
    { value: 'fear', label: '😨', color: 'text-purple-500' },
    { value: 'surprise', label: '😮', color: 'text-orange-500' },
];

export default function Index({ feedbacks }: Props) {
    const [activeResponse, setActiveResponse] = useState<number | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        reaction: '',
        response: '',
    });

    const handleSubmit = (feedbackId: number) => {
        const feedback = feedbacks.data.find(f => f.id === feedbackId);
        if (!feedback) return;

        if (mode === 'edit') {
            put(route('student.feedback.update-response', feedbackId), {
                onSuccess: () => {
                    reset();
                    setActiveResponse(null);
                    setMode('create');
                },
                preserveScroll: true,
            });
        } else {
            post(route('student.feedback.respond', feedbackId), {
                onSuccess: () => {
                    reset();
                    setActiveResponse(null);
                    setMode('create');
                },
                preserveScroll: true,
            });
        }
    };

    const handleResponseClick = (feedback: Feedback) => {
        if (activeResponse === feedback.id) {
            setActiveResponse(null);
            setMode('create');
            reset();
            return;
        }

        setActiveResponse(feedback.id);
        if (feedback.reply) {
            setMode('edit');
            setData({
                reaction: feedback.reply.reaction,
                response: feedback.reply.response,
            });
        } else {
            setMode('create');
            reset();
        }
    };

    return (
        <StudentLayout>
            <Head title="Feedback" />
            <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
                <div className="flex flex-col w-full h-full p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                            <div className="flex flex-row items-center gap-x-4">
                                <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                    <LayoutDashboard className="size-5 md:size-6 text-emerald-600" />
                                </span>
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Teacher Feedback</h1>
                                    <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                        View and respond to feedback from your teachers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {feedbacks.data.length > 0 ? (
                            <div className="space-y-4">
                                {feedbacks.data.map((feedback) => (
                                    <div key={feedback.id} className="relative bg-yellow-50 rounded-lg shadow-sm overflow-hidden border border-emerald-200">
                                        {/* Post Content */}
                                        <div className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="size-8">
                                                    <AvatarImage src={feedback.teacher.image} />
                                                    <AvatarFallback>{feedback.teacher.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-emerald-800">
                                                            {feedback.teacher.name}
                                                        </span>
                                                        <span className="text-xs text-emerald-600">
                                                            {new Date(feedback.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-emerald-700">{feedback.feedback}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Response Section */}
                                        <div className="border-t border-emerald-100">
                                            {feedback.reply ? (
                                                <div className="p-3 bg-yellow-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">
                                                            {reactions.find(r => r.value === feedback.reply?.reaction)?.label.split(' ')[0]}
                                                        </span>
                                                        <p className="text-sm text-emerald-600">{feedback.reply.response}</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleResponseClick(feedback)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-2 text-emerald-600"
                                                    >
                                                        <Pencil className="size-3 mr-1" />
                                                        Edit Response
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="p-2 bg-yellow-50">
                                                    <Button
                                                        onClick={() => handleResponseClick(feedback)}
                                                        variant="ghost"
                                                        className="w-full justify-center text-emerald-600"
                                                    >
                                                        <Send className="size-4 mr-2" />
                                                        Write a response
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Sliding Response Form */}
                                        <AnimatePresence>
                                            {activeResponse === feedback.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-emerald-200 bg-yellow-50 rounded-b-lg"
                                                >
                                                    <div className="p-4 space-y-4">
                                                        <div className="space-y-2 flex flex-col items-center justify-center">
                                                            <RadioGroup
                                                                value={data.reaction}
                                                                onValueChange={(value) => {
                                                                    setData('reaction', value);
                                                                }}
                                                                className="flex items-center justify-start gap-4"
                                                            >
                                                                {reactions.map((reaction) => (
                                                                    <div key={reaction.value} className="relative">
                                                                        <Label
                                                                            htmlFor={`reaction-${reaction.value}`}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={reaction.value}
                                                                                id={`reaction-${reaction.value}`}
                                                                                className="peer sr-only"
                                                                            />
                                                                            <div
                                                                                className={cn(
                                                                                    "flex items-center justify-center size-12 rounded-full transition-all duration-200",
                                                                                    "cursor-pointer text-2xl",
                                                                                    data.reaction === reaction.value
                                                                                        ? "opacity-100 scale-110 bg-transparent"
                                                                                        : "opacity-50 hover:opacity-80",
                                                                                    reaction.color,
                                                                                    "peer-checked:opacity-100 peer-checked:scale-110 peer-checked:bg-white peer-checked:shadow-sm",
                                                                                    "peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2"
                                                                                )}
                                                                            >
                                                                                <span>
                                                                                    {reaction.label}
                                                                                </span>
                                                                            </div>
                                                                            <div className={cn(
                                                                                "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                                                                "opacity-0 transition-all duration-200",
                                                                                "peer-checked:opacity-100 peer-checked:h-1.5 peer-checked:w-6",
                                                                                reaction.color,
                                                                                "bg-current"
                                                                            )} />
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </RadioGroup>
                                                            {errors.reaction && (
                                                                <p className="text-xs text-red-500">{errors.reaction}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-emerald-700">
                                                                Your Response
                                                            </label>
                                                            <Textarea
                                                                value={data.response}
                                                                onChange={(e) => setData('response', e.target.value)}
                                                                placeholder="Write your response here..."
                                                                className="min-h-[100px] bg-white/50 border border-emerald-400 text-emerald-700 rounded-md"
                                                            />
                                                            {errors.response && (
                                                                <p className="text-xs text-red-500">{errors.response}</p>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setActiveResponse(null);
                                                                    setMode('create');
                                                                    reset();
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleSubmit(feedback.id)}
                                                                disabled={processing || !data.response || !data.reaction}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            >
                                                                {mode === 'edit' ? 'Update' : 'Submit'} Response
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-emerald-600">
                                <MessageCircleDashed className="size-8 mb-2" />
                                <p className="text-sm font-medium">No feedback yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
