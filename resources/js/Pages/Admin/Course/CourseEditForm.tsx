import { useForm } from '@inertiajs/react';
import { Domain } from '@/types';
import { Button } from '@/shadcn/components/ui/button';
import { FormField } from '@/Components/shadcn/Form/Components';
import { SelectOption } from '@/Components/shadcn/Form/Components';

interface Course {
    id: number;
    name: string;
    description: string;
    level: string;
    faculty: string;
    institution: string;
    domain_id: number;
}

interface Props {
    course: Course;
    domains: Domain[];
    onClose: () => void;
}

export function CourseEditForm({ course, domains, onClose }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: course.name,
        description: course.description,
        level: course.level,
        faculty: course.faculty,
        institution: course.institution,
        domain_id: course.domain_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.course.update', course.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const domainOptions = domains.map(domain => ({
        label: domain.name,
        value: domain.id.toString()
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
                label="Course Name"
                value={data.name}
                onChange={(value) => setData('name', value)}
                errorMessage={errors.name}
                required
                placeholder="Enter course name"
            />

            <FormField
                label="Description"
                type="textarea"
                value={data.description}
                onChange={(value) => setData('description', value)}
                errorMessage={errors.description}
                required
                placeholder="Enter course description"
            />

            <FormField
                label="Level"
                value={data.level}
                onChange={(value) => setData('level', value)}
                errorMessage={errors.level}
                required
                placeholder="Enter course level"
            />

            <FormField
                label="Faculty"
                value={data.faculty}
                onChange={(value) => setData('faculty', value)}
                errorMessage={errors.faculty}
                required
                placeholder="Enter faculty name"
            />

            <FormField
                label="Institution"
                value={data.institution}
                onChange={(value) => setData('institution', value)}
                errorMessage={errors.institution}
                required
                placeholder="Enter institution name"
            />

            <SelectOption
                label="Domain"
                value={data.domain_id}
                onValueChange={(value) => setData('domain_id', value)}
                options={domainOptions}
                errorMessage={errors.domain_id}
                placeholder="Select a domain"
            />

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="bg-white"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    Update Course
                </Button>
            </div>
        </form>
    );
}
