import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Domain, Persona } from '@/types';
import { Subject } from '@/types/select';

// Icon
import { PlusIcon, Trash, AlertCircle, Save } from 'lucide-react';

// UI Components
import { FormField, SelectOption } from '@/Components/shadcn/Form/Components';
import { Button } from '@/shadcn/components/ui/button';
import { UploadImageField } from '@/Components/shadcn/Form/UploadField';
import { Alert, AlertDescription, AlertTitle } from '@/shadcn/components/ui/alert';
import { Spinner } from '@/shadcn/components/ui/spinner';

// Define requirement options
const requirementOptions = [
    { label: 'Grade A', value: 'A' },
    { label: 'Grade B', value: 'B' },
    { label: 'Grade C', value: 'C' },
    { label: 'Grade D', value: 'D' },
    { label: 'Grade E', value: 'E' },
    { label: 'Grade F', value: 'F' },
];

interface RoadmapForm {
    title: string;
    description: string;
    image: File | null;
    domain_id: number;
    prerequisite_items: PrerequisiteItem[];
    adaptation_items: AdaptationItem[];
    preview_image?: string | null;
}

// First, modify your type definitions
interface FormErrors {
    [key: string]: string | string[] | Record<string, string>;
}

interface PrerequisiteItem {
    subject_id: number;
    requirement: string;
}

interface AdaptationItem {
    name: string;
    persona_id: number;
}

// Retrieve Form Props from Admin/Roadmap/Create Controller
interface FormProps{
    domains: Domain[];
    personas: Persona[];
    subjects: Subject[]
}

export default function Create({ domains, personas, subjects }: FormProps) {

    // Initialize form with useForm hook
    const { data, setData, post, processing, errors } = useForm<RoadmapForm>({
        title: '',
        description: '',
        image: null,
        domain_id: 0,
        prerequisite_items: [{ subject_id: 0, requirement: '' }], // Start with one empty prerequisite
        adaptation_items: [{ persona_id: 0, name: '' }], // Start with one empty adaptation
    });

    // Add this helper function at the top of your component
    const getErrorMessage = (errors: FormErrors, field: string, index?: number) => {
        // Handle array field errors (for prerequisite_items and adaptation_items)
        if (typeof index === 'number') {
            const arrayErrors = errors[field] as Record<string, string>;
            return arrayErrors?.[index] || arrayErrors?.[`${index}`];
    }

    // Handle regular field errors
    const error = errors[field];
    if (Array.isArray(error)) return error[0];
    if (typeof error === 'string') return error;
    return undefined;
};

    // Handle prerequisite field changes
    const handlePrerequisiteChange = (
        index: number,
        field: keyof PrerequisiteItem,
        value: string | number
    ) => {
        const updatedPrerequisites = [...data.prerequisite_items];
        updatedPrerequisites[index] = {
            ...updatedPrerequisites[index],
            [field]: field === 'subject_id' ? Number(value) : value
        };
        setData('prerequisite_items', updatedPrerequisites);
    };
    // Fixed handleAdaptationChange function with proper type handling
    const handleAdaptationChange = (
        index: number,
        field: keyof AdaptationItem,
        value: string | number
    ) => {
        const updatedAdaptations = [...data.adaptation_items];
        updatedAdaptations[index] = {
            ...updatedAdaptations[index],
            [field]: field === 'persona_id' ? Number(value) : value
        };
        setData('adaptation_items', updatedAdaptations);
    };

    // Add new prerequisite field
    const addPrerequisite = () => {
        setData('prerequisite_items', [
            ...data.prerequisite_items,
            { subject_id: 0, requirement: '' }
        ]);
    };
    // Add new adaptation field
    const addAdaptation = () => {
        setData('adaptation_items', [
            ...data.adaptation_items,
            { persona_id: 0, name: '' }
        ]);
    };

    // Remove prerequisite field
    const removePrerequisite = (index: number) => {
        const updatedPrerequisites = data.prerequisite_items.filter((_, i) => i !== index);
        setData('prerequisite_items', updatedPrerequisites);
    };
    // Remove adaptation field
    const removeAdaptation = (index: number) => {
        const updatedAdaptations = data.adaptation_items.filter((_, i) => i !== index);
        setData('adaptation_items', updatedAdaptations);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.roadmap.store'), {
            onSuccess: () => {
                console.log('Roadmap created successfully');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            preserveScroll: true,
        });
    };

    const handleImageChange = (imageData: string | File) => {
        if (imageData instanceof File) {
            // Handle raw file upload
            setData('image', imageData);
            // Create temporary URL for preview
            const previewUrl = URL.createObjectURL(imageData);
            setData('preview_image', previewUrl);
        } else {
            // Handle cropped image URL
            setData('preview_image', imageData);
            // Convert URL to File if needed for form submission
            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setData('image', file);
                });
        }
    };

    return (
        <AdminLayout title="Create Roadmap">
            <Head title="Create Roadmap" />
            <div className="flex flex-col w-full pb-10 md:pb-5">
                <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                    <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col w-full gap-4">
                            <UploadImageField
                                label="Roadmap Image"
                                imagePath="/assets/placeholder.png"
                                onImageChange={handleImageChange}
                                errorMessage={errors.image}
                            />
                            <div className="flex flex-col w-full bg-emerald-50 border gap-4 border-primary rounded-lg px-4 py-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Roadmap Details</h2>
                                </div>
                                <FormField
                                    label="Roadmap Title"
                                    type="text"
                                    placeholder="Enter Roadmap title"
                                    value={data.title}
                                    onChange={e => setData('title', e)}
                                    className="md:max-w-screen-sm"
                                    errorMessage={errors.title}
                                    disabled={processing}
                                />
                                <FormField
                                    label="Roadmap Description"
                                    type="textarea"
                                    placeholder="Enter Roadmap description"
                                    value={data.description}
                                    onChange={e => setData('description', e)}
                                    className="md:max-w-screen-sm"
                                    errorMessage={errors.description}
                                    disabled={processing}
                                />
                                <div className="w-full md:max-w-md flex flex-row gap-4 pb-4">
                                    <SelectOption
                                        label="Domain"
                                        placeholder="Select domain"
                                        value={data.domain_id.toString()}
                                        onValueChange={value => setData('domain_id', parseInt(value))}
                                        options={
                                            domains.map(domain => ({ label: domain.name, value: domain.id.toString() }))
                                        }
                                        errorMessage={errors.domain_id}
                                        disabled={processing}
                                    />
                                </div>
                            </div>


                            {/* Prerequisites Section */}
                            <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Prerequisites</h2>
                                    <Button
                                        type="button"
                                        onClick={addPrerequisite}
                                        className="flex items-center gap-2"
                                        disabled={processing}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Prerequisite
                                    </Button>
                                </div>

                                {/* Dynamic Prerequisites Fields */}
                                <div className="flex flex-col">
                                    {data.prerequisite_items.map((item, index) => (
                                        <div key={index} className={`flex flex-col items-start p-4 ${data.prerequisite_items.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                            <div className="w-full flex flex-row justify-between">
                                                <h3 className="text-md font-semibold">Prerequisite {index + 1}</h3>
                                                {data.prerequisite_items.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => removePrerequisite(index)}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                            </div>

                                            <div className="w-full md:max-w-screen-md flex flex-row gap-4">
                                                <SelectOption
                                                    label="Subject"
                                                    placeholder="Select subject"
                                                    value={item.subject_id.toString()}
                                                    onValueChange={value =>
                                                        handlePrerequisiteChange(index, 'subject_id', value)
                                                    }
                                                    options={
                                                        subjects.map(subject => ({ label: subject.name, value: subject.id.toString() }))
                                                    }
                                                    disabled={processing}
                                                />
                                                <SelectOption
                                                    label="Required Grade"
                                                    placeholder="Select required grade"
                                                    value={item.requirement}
                                                    onValueChange={value =>
                                                        handlePrerequisiteChange(index, 'requirement', value)
                                                    }
                                                    options={requirementOptions}
                                                    disabled={processing}
                                                />
                                            </div>

                                            {/* Show general error for this item if any */}
                                            {(getErrorMessage(errors, `prerequisite_items.${index}.subject_id`) || getErrorMessage(errors, `prerequisite_items.${index}.requirement`)) && (
                                                <Alert variant="destructive" className="mt-2 bg-rose-100">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle className="mb-2 underline">Please ensure that the form is filled out correctly:</AlertTitle>
                                                    <AlertDescription className="pt-1">
                                                        {getErrorMessage(errors, `prerequisite_items.${index}.subject_id`) && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Subject: </span> Please select a subject selected
                                                            </p>
                                                        )}
                                                        {getErrorMessage(errors, `prerequisite_items.${index}.requirement`) && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Required Grade: </span> Please select a required grade
                                                            </p>
                                                        )}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Persona</h2>
                                    <Button
                                        type="button"
                                        onClick={addAdaptation}
                                        className="flex items-center gap-2"
                                        disabled={processing}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Persona
                                    </Button>
                                </div>
                                {/* Dynamic Personas Fields */}
                                <div className="flex flex-col">
                                    {data.adaptation_items.map((item, index) => (
                                        <div key={index} className={`flex flex-col items-start p-4 ${data.adaptation_items.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                            <div className="w-full flex flex-row justify-between">
                                                <h3 className="text-md font-semibold">Persona {index + 1}</h3>
                                                {data.adaptation_items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => removeAdaptation(index)}
                                                        disabled={processing}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="w-full md:max-w-screen-md flex lg:flex-row flex-col gap-4">
                                                <FormField
                                                    label="Personality Needs"
                                                    type="text"
                                                    placeholder="Describe roadmap personality needs"
                                                    value={item.name}
                                                    onChange={e => handleAdaptationChange(index, 'name', e)}
                                                    className="w-full md:max-w-screen-sm"
                                                    disabled={processing}
                                                />
                                                <SelectOption
                                                    label="Persona"
                                                    placeholder="Select persona"
                                                    value={item.persona_id.toString()}
                                                    onValueChange={value =>
                                                        handleAdaptationChange(index, 'persona_id', value)
                                                    }
                                                    options={
                                                        personas.map(persona => ({ label: persona.name, value: persona.id.toString() }))
                                                    }
                                                    disabled={processing}
                                                />
                                            </div>

                                            {/* Show general error for this item if any */}
                                            {(getErrorMessage(errors, `adaptation_items.${index}.persona_id`) || getErrorMessage(errors, `adaptation_items.${index}.name`)) && (
                                                <Alert variant="destructive" className="mt-2 bg-rose-100">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle className="mb-2 underline">Please ensure that the form is filled out correctly:</AlertTitle>
                                                    <AlertDescription className="pt-1">
                                                        {getErrorMessage(errors, `adaptation_items.${index}.persona_id`) && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Persona: </span> Please select persona selected
                                                            </p>
                                                        )}
                                                        {getErrorMessage(errors, `adaptation_items.${index}.name`) && (
                                                            <p className="text-xs">
                                                                <span className="font-semibold">Personality Needs: </span> Please enter personality needs
                                                            </p>
                                                        )}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner className="mr-2 text-emerald-900" /> Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="mr-2 size-4" /> Create Roadmap
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}
