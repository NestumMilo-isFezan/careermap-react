import { FormProps, Subject } from '@/types/form';
import { Label } from '@/shadcn/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import { router } from '@inertiajs/react';
import { SelectOption } from '@/Components/shadcn/Form/Components';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Button } from '@/shadcn/components/ui/button';
import { ArrowRight, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface GradeFormData {
    grades: Array<{
        subject_id: number;
        grade: string;
    }>;
}

interface GradeFormProps {
    form: FormProps<GradeFormData>;
    coreSubjects: Subject[];
    streamSubjects: Subject[];
    optionalSubjects: Subject[];
    streamName: string;
    onSubmit: (e: React.FormEvent) => void;
}

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'F', 'TH'];

export default function GradeForm({
    form,
    coreSubjects,
    streamSubjects: initialStreamSubjects,
    optionalSubjects: initialOptionalSubjects,
    streamName,
    onSubmit
}: GradeFormProps) {
    const [visibleStreamSubjects, setVisibleStreamSubjects] = useState(initialStreamSubjects);
    const [deletedSubjects, setDeletedSubjects] = useState<Subject[]>([]);
    const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState<Subject[]>([]);
    const [availableOptionalSubjects, setAvailableOptionalSubjects] = useState<Subject[]>(initialOptionalSubjects);

    const handleNoTrialSPM = () => {
        form.reset();
        router.get(route('guest.register.students.skip-grades'));
    };

    const handleGradeChange = (subjectId: number, grade: string) => {
        const currentGrades = [...form.data.grades];
        const existingGradeIndex = currentGrades.findIndex(g => g.subject_id === subjectId);

        if (existingGradeIndex !== -1) {
            currentGrades[existingGradeIndex].grade = grade;
        } else {
            currentGrades.push({ subject_id: subjectId, grade });
        }

        form.setData('grades', currentGrades);
    };

    const handleDeleteSubject = (subjectId: number) => {
        const subjectToDelete = visibleStreamSubjects.find(s => s.id === subjectId);
        if (subjectToDelete) {
            setVisibleStreamSubjects(prev => prev.filter(s => s.id !== subjectId));
            setDeletedSubjects(prev => [...prev, subjectToDelete]);

            const updatedGrades = form.data.grades.filter(g => g.subject_id !== subjectId);
            form.setData('grades', updatedGrades);
        }
    };

    const handleAddSubject = (subject: Subject) => {
        setVisibleStreamSubjects(prev => [...prev, subject]);
        setDeletedSubjects(prev => prev.filter(s => s.id !== subject.id));
    };

    const handleAddOptionalSubject = (subject: Subject) => {
        setSelectedOptionalSubjects(prev => [...prev, subject]);
        setAvailableOptionalSubjects(prev => prev.filter(s => s.id !== subject.id));
    };

    const handleDeleteOptionalSubject = (subjectId: number) => {
        const subjectToDelete = selectedOptionalSubjects.find(s => s.id === subjectId);
        if (subjectToDelete) {
            setSelectedOptionalSubjects(prev => prev.filter(s => s.id !== subjectId));
            setAvailableOptionalSubjects(prev => [...prev, subjectToDelete]);

            const updatedGrades = form.data.grades.filter(g => g.subject_id !== subjectId);
            form.setData('grades', updatedGrades);
        }
    };

    const areAllGradesFilled = () => {
        const requiredSubjects = [...coreSubjects];
        return requiredSubjects.every(subject =>
            form.data.grades.some(grade =>
                grade.subject_id === subject.id && grade.grade
            )
        );
    };

    return (
        <div className="flex flex-col pt-8">
            <div className="px-8 pb-4 mb-4 border-b border-emerald-500 flex flex-row justify-between">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-emerald-800">Academics Information</h2>
                    <p className="text-emerald-800/50 text-sm">Please fill in your Trial SPM Results.</p>
                </div>

                <div className="mt-4 mb-3">
                    <button
                        type="button"
                        onClick={handleNoTrialSPM}
                        className="text-emerald-600 underline hover:text-emerald-700 text-sm"
                    >
                        I haven't taken Trial SPM yet
                    </button>
                </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="grid px-8">
                    {/* Core Subjects Section */}
                    <div className="space-y-4 pb-8 border-b border-emerald-500">
                        <div className="flex flex-col">
                            <h3 className="font-medium text-green-800">Core Subjects</h3>
                            <p className="text-emerald-800/50 text-sm">Please fill in your Core Subjects Results.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {coreSubjects.map((subject) => (
                                <div key={subject.id} className="flex flex-col gap-2">
                                    <SelectOption
                                        label={subject.name}
                                        value={form.data.grades?.find(g => g.subject_id === subject.id)?.grade || ''}
                                        onValueChange={(value) => handleGradeChange(subject.id, value)}
                                        options={GRADE_OPTIONS.map((grade) => ({
                                            label: grade,
                                            value: grade
                                        }))}
                                        placeholder="Grade"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modified Science Stream Subjects Section */}
                    <div className="space-y-4  pt-4 pb-8 border-b border-emerald-500">
                        <div className="flex flex-col">
                            <div className="w-full flex flex-row justify-between items-center">
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-green-800">{streamName} Subjects</h3>
                                    <p className="text-emerald-800/50 text-sm">Please fill in your {streamName} Results.</p>
                                </div>
                                {deletedSubjects.length > 0 && (
                                    <div className="flex flex-col w-full max-w-xs gap-2">
                                        <Select
                                            value=""
                                            onValueChange={(value) => {
                                                const subject = deletedSubjects.find(s => s.id === parseInt(value));
                                                if (subject) handleAddSubject(subject);
                                            }}
                                        >
                                            <SelectTrigger className="border-emerald-500 bg-stone-50">
                                                <SelectValue placeholder="Add subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deletedSubjects.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                        {visibleStreamSubjects.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-4">
                                {visibleStreamSubjects.map((subject) => (
                                    <div key={subject.id} className="flex flex-col gap-2">
                                        <Label>{subject.name}</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <Select
                                                    onValueChange={(value) => handleGradeChange(subject.id, value)}
                                                    value={form.data.grades?.find(g => g.subject_id === subject.id)?.grade || ''}
                                                >
                                                    <SelectTrigger className="border-emerald-500 bg-stone-50">
                                                        <SelectValue placeholder="Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {GRADE_OPTIONS.map((grade) => (
                                                            <SelectItem key={grade} value={grade}>
                                                                {grade}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="h-8 w-8 shrink-0 bg-rose-500 hover:bg-rose-600"
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-2 justify-center items-center pt-4">
                                <p className="text-emerald-800/50 text-sm">No {streamName.toLowerCase()} subjects selected.</p>
                            </div>
                        )}
                    </div>

                    {/* Optional Subjects Section */}
                    <div className="space-y-4 pt-4">
                        <div className="flex flex-col">
                            <div className="w-full flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-green-800">Optional Subjects</h3>
                                    <p className="text-emerald-800/50 text-sm">Add any additional subjects you've taken (optional).</p>
                                </div>
                                {availableOptionalSubjects.length > 0 && (
                                    <div className="flex flex-col w-full max-w-xs gap-2 justify-end">
                                        <Select
                                            value=""
                                            onValueChange={(value) => {
                                                const subject = availableOptionalSubjects.find(s => s.id === parseInt(value));
                                                if (subject) handleAddOptionalSubject(subject);
                                            }}
                                        >
                                            <SelectTrigger className="border-emerald-500 bg-stone-50">
                                                <SelectValue placeholder="Add optional subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableOptionalSubjects.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                        {selectedOptionalSubjects.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-4">
                                {selectedOptionalSubjects.map((subject) => (
                                    <div key={subject.id} className="flex flex-col gap-2">
                                        <Label>{subject.name}</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <Select
                                                    onValueChange={(value) => handleGradeChange(subject.id, value)}
                                                    value={form.data.grades?.find(g => g.subject_id === subject.id)?.grade || ''}
                                                >
                                                    <SelectTrigger className="border-emerald-500 bg-stone-50">
                                                        <SelectValue placeholder="Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {GRADE_OPTIONS.map((grade) => (
                                                            <SelectItem key={grade} value={grade}>
                                                                {grade}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="h-8 w-8 shrink-0 bg-rose-500 hover:bg-rose-600"
                                                onClick={() => handleDeleteOptionalSubject(subject.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-2 justify-center items-center pt-4">
                                <p className="text-emerald-800/50 text-sm">No optional subjects selected.</p>
                            </div>
                        )}
                    </div>
                </div>



                <div className="flex flex-col justify-center p-4 mb-2">
                    {!areAllGradesFilled() && (
                        <p className="text-red-500 text-sm mb-2">
                            Please fill in all subject grades before continuing
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={form.processing || !areAllGradesFilled()}
                        className="w-full"
                        size="lg"
                    >
                        {form.processing ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="mr-2 text-emerald-900" /> Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 font-bold">
                                <ArrowRight className="mr-2 size-6" /> Continue
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
