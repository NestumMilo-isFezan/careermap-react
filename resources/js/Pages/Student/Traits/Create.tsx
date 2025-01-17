import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm } from '@inertiajs/react';
import { Info, ClipboardCheck, Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/shadcn/lib/utils';
import { FormProps } from '@/types/form';

interface Answer {
    text: string;
    personaId: number;
}

interface Question {
    id: number;
    question: string;
    answers: Answer[];
}

interface AnswerFormData {
    student_answers: Array<{
        question_id: number;
        persona_id: number;
    }>;
}

interface CreateProps {
    data: Question[];
}

const QUESTIONS_PER_PAGE = 5;

export default function Create({ data }: CreateProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressBarPosition = useRef<number>(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Initialize form with Inertia
    const { data: formData, setData, post, processing } = useForm<AnswerFormData>({
        student_answers: []
    });

    const totalPages = Math.ceil(data.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, data.length);
    const currentQuestions = data.slice(startIndex, endIndex);

    const handleAnswerSelect = (questionId: number, personaId: number) => {
        // Find if an answer for this question already exists
        const existingAnswerIndex = formData.student_answers.findIndex(
            answer => answer.question_id === questionId
        );

        if (existingAnswerIndex !== -1) {
            // Update existing answer
            const updatedAnswers = [...formData.student_answers];
            updatedAnswers[existingAnswerIndex] = { question_id: questionId, persona_id: personaId };
            setData('student_answers', updatedAnswers);
        } else {
            // Add new answer
            setData('student_answers', [
                ...formData.student_answers,
                { question_id: questionId, persona_id: personaId }
            ]);
        }
    };

    const handleSubmit = () => {
        // Check if all questions are answered
        if (formData.student_answers.length !== data.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        post(route('student.traits.store'));
    };

    const canGoNext = currentQuestions.every(q =>
        formData.student_answers.some(answer => answer.question_id === q.id)
    );
    const isLastPage = currentPage === totalPages - 1;
    const progress = Math.round((formData.student_answers.length / data.length) * 100);

    useEffect(() => {
        const handleScroll = () => {
            if (progressBarRef.current) {
                if (!progressBarPosition.current) {
                    progressBarPosition.current = progressBarRef.current.offsetTop;
                }

                const scrollPosition = window.scrollY;
                const shouldBeSticky = scrollPosition > progressBarPosition.current;

                if (shouldBeSticky !== isSticky) {
                    setIsSticky(shouldBeSticky);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    // Add this new function to handle page navigation
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };

    return (
        <StudentLayout>
            <Head title="Traits Assessment" />
            <div ref={contentRef} className="flex flex-col w-full gap-6 pb-10">
                {/* Hero Section */}
                <div className="w-full px-8 py-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-full">
                        <div className="flex flex-row gap-x-4 items-center py-2">
                            <span className="inline-block p-3 bg-emerald-100 rounded-md">
                                <Brain className="size-6 text-emerald-600" />
                            </span>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-emerald-950">
                                    Career Traits Assessment
                                </h1>
                                <p className="text-emerald-700 text-sm text-justify max-w-lg">
                                    Unlock your potential by understanding your personality traits
                                    and discover career paths that align with who you are.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 pt-4 pb-6 mb-2 border-b border-emerald-200 w-full">
                            <Info className="w-4 h-4 text-emerald-600" />
                            <p className="text-emerald-700 text-sm underline">
                                Please answer all questions to get the best results.
                            </p>
                        </div>

                        {/* Progress Bar Container */}
                        <div
                            ref={progressBarRef}
                            className={cn(
                                "transition-all duration-300 w-full",
                                isSticky && "fixed top-0 left-0 right-0 bg-emerald-50 shadow-md z-50 px-8 py-4"
                            )}
                        >
                            <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between text-sm text-emerald-700 mb-1">
                                    {isSticky && (
                                        <span className="font-medium">
                                            Career Traits Assessment
                                        </span>
                                    )}
                                    <span className="ml-auto">
                                        {progress}% Complete
                                    </span>
                                </div>
                                <div className="w-full bg-emerald-100 rounded-full h-2.5">
                                    <div
                                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Add a spacer when progress bar is sticky */}
                        {isSticky && <div className="h-16" />}
                    </div>

                    {/* Questions */}
                    <div className="flex flex-col gap-4 pt-6">
                        {currentQuestions.map((question) => (
                            <Card key={question.id}>
                                <CardHeader>
                                    <h3 className="font-semibold text-gray-900">
                                        {question.question}
                                    </h3>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    {question.answers.map((answer, index) => {
                                        const isSelected = formData.student_answers.some(
                                            a => a.question_id === question.id && a.persona_id === answer.personaId
                                        );
                                        return (
                                            <Button
                                                key={index}
                                                variant={isSelected ? "default" : "outline"}
                                                className="justify-start text-left h-auto py-3"
                                                onClick={() => handleAnswerSelect(question.id, answer.personaId)}
                                            >
                                                {answer.text}
                                            </Button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        <Button
                            onClick={isLastPage ? handleSubmit : () => handlePageChange(currentPage + 1)}
                            disabled={!canGoNext || (isLastPage && processing)}
                            className="flex items-center gap-2"
                        >
                            {isLastPage ? (
                                <>
                                    Submit
                                    <ClipboardCheck className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Page Indicator */}
                    <div className="text-center mt-4 text-sm text-emerald-700">
                        Page {currentPage + 1} of {totalPages}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
