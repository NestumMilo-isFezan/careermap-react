import { FormProps, Subject } from '@/types/form';
import { Label } from '@/shadcn/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import { router } from '@inertiajs/react';
import { SelectOption } from '@/Components/shadcn/Form/Components';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Button } from '@/shadcn/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
    streamName: string;
    onSubmit: (e: React.FormEvent) => void;
}

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'F'];

export default function GradeForm({
    form,
    coreSubjects,
    streamSubjects,
    streamName,
    onSubmit
}: GradeFormProps) {
    const handleNoTrialSPM = () => {
        router.post(route('guest.register.students.skip-grades'));
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

    const areAllGradesFilled = () => {
        const requiredSubjects = [...coreSubjects, ...streamSubjects];
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
                <div className="grid gap-6 px-8">
                    {/* Core Subjects Section */}
                    <div className="space-y-4">
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

                    {/* Science Stream Subjects Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <h3 className="font-medium text-green-800">{streamName} Subjects</h3>
                            <p className="text-emerald-800/50 text-sm">Please fill in your {streamName} Results.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {streamSubjects.map((subject) => (
                                <div key={subject.id} className="flex flex-col gap-2">
                                    <Label>{subject.name}</Label>
                                    <Select
                                        onValueChange={(value) => handleGradeChange(subject.id, value)}
                                    >
                                        <SelectTrigger className="py-4 border-emerald-500 bg-stone-50">
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
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center p-4">
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
                    {!areAllGradesFilled() && (
                        <p className="text-red-500 text-sm mt-2">
                            Please fill in all subject grades before continuing
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
