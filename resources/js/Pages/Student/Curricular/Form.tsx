import { useForm } from '@inertiajs/react';
import { FormField, SelectOption } from '@/Components/shadcn/Form/Components';
import { DocumentUploadField } from '@/Components/shadcn/Form/DocumentUploadField';
import { Button } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Save } from 'lucide-react';
import { Curriculum } from '@/types';

interface CurricularFormData {
    name: string;
    description: string;
    level: string;
    document: File | null;
    type: string;
}

interface FormProps {
    curriculum?: Curriculum;
    mode: 'create' | 'edit';
    onClose: () => void;
}

export default function Form({ curriculum, mode = 'create', onClose }: FormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<CurricularFormData>({
        name: curriculum?.name || '',
        description: curriculum?.description || '',
        level: curriculum?.level || '',
        document: null,
        type: curriculum?.type || '',
    });

    const levelOptions = [
        { value: 'school', label: 'School' },
        { value: 'district', label: 'District' },
        { value: 'state', label: 'State' },
        { value: 'national', label: 'National' },
        { value: 'international', label: 'International' },
    ];

    const typeOptions = [
        { value: 'certificates', label: 'Certificates' },
        { value: 'activities', label: 'Activities' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitCallback = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (mode === 'create') {
            post(route('student.curricular.store'), submitCallback);
        } else {
            put(route('student.curricular.update', curriculum?.id), submitCallback);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 w-full md:max-w-2xl mx-auto">
            <FormField
                label="Name"
                value={data.name}
                onChange={(value) => setData('name', value)}
                errorMessage={errors.name}
                placeholder="Enter curricular name"
                disabled={processing}
            />

            <FormField
                label="Description"
                type="textarea"
                value={data.description}
                onChange={(value) => setData('description', value)}
                errorMessage={errors.description}
                placeholder="Enter curricular description"
                disabled={processing}
                className="min-h-[100px]"
            />

            <SelectOption
                label="Level"
                value={data.level}
                onValueChange={(value) => setData('level', value)}
                options={levelOptions}
                errorMessage={errors.level}
                placeholder="Select level"
                disabled={processing}
            />

            <SelectOption
                label="Type"
                value={data.type}
                onValueChange={(value) => setData('type', value)}
                options={typeOptions}
                errorMessage={errors.type}
                placeholder="Select type"
                disabled={processing}
            />

            <DocumentUploadField
                onFileChange={(file) => setData('document', file)}
                errorMessage={errors.document}
                label="Curricular Document"
                hint="Upload the curricular document"
            />

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? (
                    <span className="flex items-center gap-2">
                        <Spinner className="mr-2 text-emerald-900" /> Saving...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Save className="mr-2 size-4" />
                        {mode === 'create' ? 'Create' : 'Update'} Curricular
                    </span>
                )}
            </Button>
        </form>
    );
}
