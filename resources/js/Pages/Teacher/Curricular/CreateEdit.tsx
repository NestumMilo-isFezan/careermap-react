import React from 'react';
import { useForm } from '@inertiajs/react';
import { FormField, SelectOption } from '@/Components/shadcn/Form/Components';
import { Button } from '@/shadcn/components/ui/button';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import { Curriculum, SoftSkill } from '@/types';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shadcn/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/shadcn/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/shadcn/components/ui/spinner';

interface CreateEditProps {
    curriculum: Curriculum;
    softskills: SoftSkill[];
    onClose: () => void;
}

interface FormData {
    curriculum_id: number;
    softskills: {
        id: number;
        score: number;
    }[];
}

interface FormErrors {
    [key: string]: string | string[] | Record<string, string>;
}

export default function CreateEdit({ curriculum, softskills, onClose }: CreateEditProps) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        curriculum_id: curriculum.id,
        softskills: []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('teacher.curricular.store'), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleAddSoftSkill = () => {
        setData('softskills', [
            ...data.softskills,
            { id: 0, score: 0 }
        ]);
    };

    const handleRemoveSoftSkill = (index: number) => {
        setData('softskills', data.softskills.filter((_, i) => i !== index));
    };

    const handleSoftSkillChange = (index: number, skillId: string) => {
        const updatedSoftSkills = [...data.softskills];
        updatedSoftSkills[index] = {
            ...updatedSoftSkills[index],
            id: parseInt(skillId)
        };
        setData('softskills', updatedSoftSkills);
    };

    const handleScoreChange = (index: number, score: string) => {
        const updatedSoftSkills = [...data.softskills];
        updatedSoftSkills[index] = {
            ...updatedSoftSkills[index],
            score: parseInt(score)
        };
        setData('softskills', updatedSoftSkills);
    };

    // Get available soft skills (excluding already selected ones)
    const getAvailableSoftSkills = (currentSkillId: number) => {
        return softskills
            .filter(skill =>
                skill.id === currentSkillId ||
                !data.softskills.some(s => s.id === skill.id)
            )
            .map(skill => ({
                label: skill.name,
                value: skill.id.toString()
            }));
    };

    const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`
    }));

    // Add error helper function
    const getErrorMessage = (errors: FormErrors, field: string, index?: number) => {
        if (typeof index === 'number') {
            const arrayErrors = errors[field] as Record<string, string>;
            return arrayErrors?.[index] || arrayErrors?.[`${index}`];
        }
        const error = errors[field];
        if (Array.isArray(error)) return error[0];
        if (typeof error === 'string') return error;
        return undefined;
    };

    return (
        <DialogContent className="w-full h-full md:h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Assess Curriculum</DialogTitle>
                <DialogDescription>
                    Evaluate student's soft skills for: {curriculum.name}
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 min-h-0 bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-lg p-4 border border-primary">
                <div className="h-full bg-emerald-100/50 border border-primary rounded-lg p-4">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {data.softskills.map((softSkill, index) => (
                                <div key={index} className="flex flex-row gap-2 items-center">
                                    <div className="flex-1">
                                        <SelectOption
                                            label="Soft Skill"
                                            placeholder="Select a soft skill"
                                            value={softSkill.id.toString()}
                                            onValueChange={(value) => handleSoftSkillChange(index, value)}
                                            options={getAvailableSoftSkills(softSkill.id)}
                                            errorMessage={getErrorMessage(errors, `softskills.${index}.id`)}
                                        />
                                    </div>
                                    <div className="w-32">
                                        <SelectOption
                                            label="Score"
                                            placeholder="Score"
                                            value={softSkill.score.toString()}
                                            onValueChange={(value) => handleScoreChange(index, value)}
                                            options={scoreOptions}
                                            errorMessage={getErrorMessage(errors, `softskills.${index}.score`)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="mt-5 bg-red-300 hover:bg-red-600 text-red-700 hover:text-white border-red-500"
                                        onClick={() => handleRemoveSoftSkill(index)}
                                        disabled={processing}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}

                            {/* Add validation error alert if needed */}
                            {(errors.softskills || Object.keys(errors).some(key => key.startsWith('softskills.'))) && (
                                <Alert variant="destructive" className="mt-2 bg-rose-100">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="mb-2 underline">Please ensure that the form is filled out correctly:</AlertTitle>
                                    <AlertDescription className="pt-1">
                                        {errors.softskills && typeof errors.softskills === 'string' && (
                                            <p className="text-xs">{errors.softskills}</p>
                                        )}
                                        {data.softskills.map((_, index) => (
                                            <React.Fragment key={index}>
                                                {getErrorMessage(errors, `softskills.${index}.id`) && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">Soft Skill {index + 1}: </span>
                                                        Please select a soft skill
                                                    </p>
                                                )}
                                                {getErrorMessage(errors, `softskills.${index}.score`) && (
                                                    <p className="text-xs">
                                                        <span className="font-semibold">Score {index + 1}: </span>
                                                        Please select a score
                                                    </p>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddSoftSkill}
                                className="w-full"
                                disabled={processing}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Soft Skill
                            </Button>
                        </div>

                        {/* Form Actions - Fixed at bottom */}
                        <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner className="mr-2 text-emerald-900" /> Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="mr-1.5 h-4 w-4" />
                                        Submit Assessment
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DialogContent>
    );
}
