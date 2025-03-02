import { FormProps } from '@/types/form';
import { Button } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { ArrowRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { SelectOption } from '@/Components/shadcn/Form/Components';

interface StudentFormData {
    school_id: number;
    stream_id: number;
    classroom_id: number;
}

interface StudentDetailsFormProps {
    form: FormProps<StudentFormData>;
    schools: any[];
    streams: any[];
    classrooms: any[];
    queryParams: any;
    onSubmit: (e: React.FormEvent) => void;
}

export default function StudentDetailsForm({
    form,
    schools,
    streams,
    classrooms,
    queryParams,
    onSubmit
}: StudentDetailsFormProps) {
    const [schoolId, setSchoolId] = useState(queryParams?.school_id ?? '0');
    form.data.school_id = schoolId ? parseInt(schoolId) : 0;
    const schoolChanged = (value: string) => {
        if(value) {
            if(value === '0' || value === '') {
                delete queryParams['school_id'];
            }
            else{
                queryParams['school_id'] = value;
            }
        }
        else{
            delete queryParams['school_id'];
        }

        router.get(route('guest.register.students'), queryParams, { preserveState: true, preserveScroll: true });
    };
    return (
        <div className="flex flex-col pt-8">
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="grid gap-6 px-8">
                    <div className="flex flex-col gap-2">
                        <SelectOption
                            label="School"
                            options={schools.map((school) => ({ value: school.id.toString(), label: school.name }))}
                            placeholder="Select School"
                            value={schoolId}
                            onValueChange={(value) => {
                                setSchoolId(value);
                                form.setData('school_id', parseInt(value));
                                schoolChanged(value);
                            }}
                            errorMessage={form.errors.school_id}
                        />
                    </div>

                    <div className="flex flex-col">
                        <SelectOption
                            label="Classroom"
                            options={classrooms.map((classroom) => ({ value: classroom.id.toString(), label: classroom.name }))}
                            placeholder="Select Classroom"
                            value={form.data.classroom_id.toString()}
                            onValueChange={(value) => form.setData('classroom_id', parseInt(value))}
                            errorMessage={form.errors.classroom_id}
                            disabled={!form.data.school_id}
                            instructions={!form.data.school_id ? "Select School First" : undefined}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <SelectOption
                            label="Stream"
                            options={streams.map((stream) => ({ value: stream.id.toString(), label: stream.name }))}
                            placeholder="Select Stream"
                            value={form.data.stream_id.toString()}
                            onValueChange={(value) => form.setData('stream_id', parseInt(value))}
                            errorMessage={form.errors.stream_id}
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
