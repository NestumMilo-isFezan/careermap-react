import { useForm } from '@inertiajs/react';
import { FormField } from '@/Components/shadcn/Form/Components';
import { Button } from '@/shadcn/components/ui/button';
import { Save } from 'lucide-react';
import { Classroom } from '@/types';

interface FormProps {
    mode: 'add' | 'edit';
    classroom?: Classroom | null;
    onClose: () => void;
}

interface ClassroomForm {
    name: string;
}

export default function CreateEditForm({ mode, classroom, onClose }: FormProps) {
    const { data, setData, post, put, processing, errors } = useForm<ClassroomForm>({
        name: classroom?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'add') {
            post(route('admin.classroom.store'), {
                onSuccess: () => {
                    onClose();
                },
                preserveScroll: true,
            });
        } else if (mode === 'edit' && classroom) {
            put(route('admin.classroom.update', classroom.id), {
                onSuccess: () => {
                    onClose();
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                <FormField
                    label="Classroom Name"
                    value={data.name}
                    onChange={(value) => setData('name', value)}
                    errorMessage={errors.name}
                    placeholder="Enter classroom name"
                    required
                />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    <Save className="mr-1.5 h-4 w-4" />
                    {mode === 'add' ? 'Add' : 'Update'} Classroom
                </Button>
            </div>
        </form>
    );
}
