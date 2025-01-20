import { FormProps } from '@/types/form';
import { Button } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { ArrowRight } from 'lucide-react';
import { SelectOption } from '@/Components/shadcn/Form/Components';

interface TeacherClassFormData {
    classroom_id: number;
}

interface UpdateTeacherClassProps {
    form: FormProps<TeacherClassFormData>;
    classrooms: any[];
    onSubmit: (e: React.FormEvent) => void;
}

export default function UpdateTeacherClass({
    form,
    classrooms,
    onSubmit
}: UpdateTeacherClassProps) {
    return (
        <div className="flex flex-col pt-8">
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="grid gap-6 px-8">

                    <div className="flex flex-col">
                        <SelectOption
                            label="Classroom"
                            options={classrooms.map((classroom) => ({ value: classroom.id.toString(), label: classroom.name }))}
                            placeholder="Select Classroom"
                            value={form.data.classroom_id.toString()}
                            onValueChange={(value) => form.setData('classroom_id', parseInt(value))}
                            errorMessage={form.errors.classroom_id}
                        />
                    </div>
                </div>

                <div className="flex justify-center px-8 py-4">
                    {/* Submit Button */}
                    <Button type="submit" disabled={form.processing} className="w-full" size="lg">
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
