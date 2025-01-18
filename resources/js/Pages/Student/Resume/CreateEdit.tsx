import StudentLayout from "@/Layouts/StudentLayout";
import { User } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/shadcn/components/ui/button";
import { Medal } from "lucide-react";
import { FormField, SelectOption } from "@/Components/shadcn/Form/Components";
import { DatePicker } from "@/Components/shadcn/Form/Calendar";
import { useState, useEffect } from "react";
import { PlusIcon, Trash, Save } from "lucide-react";
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/shadcn/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { UploadImageField } from "@/Components/shadcn/Form/UploadField";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/components/ui/tabs";
import { PDFViewer } from '@react-pdf/renderer';
import ResumePDF from '@/Pages/Student/Resume/ResumePDF';
import { Switch } from "@/shadcn/components/ui/switch";
import { motion, AnimatePresence } from "motion/react";

type ResumeFormData = {
    _method?: string;
    profile: {
        name: string;
        email: string;
        phone: string;
        address: string;
        image: File | null;
        image_preview: string;
    },
    summary: string;
    education: Array<{
        school: string;
        education_level: string;
        start_date: string;
        end_date: string;
    }>,
    experiences: Array<{
        activity: string;
        position: string;
        start_date: string;
        end_date: string;
    }>,
    certifications: Array<{
        certification: string;
        date_of_issue: string;
    }>,
    skills: Array<{
        skill: string;
        level: string;
    }>,
    soft_skills: Array<{
        soft_skill: string;
        level: string;
    }>,
    languages: Array<{
        language: string;
        level: string;
    }>,
}

interface Props {
    resumePrefillData?: ResumeFormData;
    resumeEditData?: ResumeFormData;
    edit?: boolean;
}

interface FormErrors {
    [key: string]: string | string[] | {
        [key: string]: string;
    } | undefined;
    'profile.name'?: string;
    'profile.email'?: string;
    'profile.phone'?: string;
    'profile.address'?: string;
    'profile.image'?: string;
}

const proficiencyLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Basic', value: 'basic' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
];

export default function CreateEdit({ resumePrefillData, resumeEditData, edit = false }: Props) {
    // const user = usePage().props.auth.user;
    // const profile = usePage().props.auth.profile;
    const initialData = edit ? resumeEditData : resumePrefillData;
    const [viewResume, setViewResume] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("edit");
    const [pdfKey, setPdfKey] = useState(0);

    useEffect(() => {
        if (activeTab === "view") {
            setPdfKey(prev => prev + 1);
        }
    }, [activeTab]);

    const { data: formData, setData, post, processing, errors } = useForm<ResumeFormData>({
        _method: edit ? 'put' : 'post',
        profile: {
            name: initialData?.profile.name || '',
            email: initialData?.profile.email || '',
            phone: initialData?.profile.phone || '',
            address: initialData?.profile.address || '',
            image: null,
            image_preview: initialData?.profile.image_preview || '',
        },
        summary: initialData?.summary || '',
        education: initialData?.education || [
            {
                school: '',
                education_level: '',
                start_date: '',
                end_date: '',
            }
        ],
        experiences: initialData?.experiences || [{
            activity: '',
            position: '',
            start_date: '',
            end_date: '',
        }],
        certifications: initialData?.certifications || [{
            certification: '',
            date_of_issue: '',
        }],
        skills: initialData?.skills || [{
            skill: '',
            level: '',
        }],
        soft_skills: initialData?.soft_skills || [{
            soft_skill: '',
            level: '',
        }],
        languages: initialData?.languages || [{
            language: '',
            level: '',
        }],
    });

    const getErrorMessage = (errors: FormErrors, field: string, index?: number) => {
        // For nested profile fields
        if (field.startsWith('profile.')) {
            // Direct access to profile.field format
            const error = errors[field];
            if (typeof error === 'string') return error;
            if (Array.isArray(error)) return error[0];
            return undefined;
        }

        // For array fields with index
        if (typeof index === 'number') {
            const [section, subfield] = field.split('.');

            // Try dot notation format first (e.g., "education.0.school")
            const dotNotationKey = `${section}.${index}.${subfield}`;
            const dotNotationError = errors[dotNotationKey];
            if (typeof dotNotationError === 'string') {
                return dotNotationError;
            }

            // Try nested format
            const sectionErrors = errors[section];
            if (sectionErrors && typeof sectionErrors === 'object' && !Array.isArray(sectionErrors)) {
                const indexErrors = (sectionErrors as any)[index];
                if (indexErrors && typeof indexErrors === 'object') {
                    return indexErrors[subfield];
                }
            }

            return undefined;
        }

        // For regular fields
        const error = errors[field];
        if (Array.isArray(error)) return error[0];
        if (typeof error === 'string') return error;
        return undefined;
    };

    const handleImageChange = (imageData: string | File) => {
        if (imageData instanceof File) {
            setData(prev => ({...prev, profile: {...prev.profile, image: imageData}}));
            const previewUrl = URL.createObjectURL(imageData);
            setData(prev => ({...prev, profile: {...prev.profile, image_preview: previewUrl}}));
        } else {
            setData(prev => ({...prev, profile: {...prev.profile, image_preview: imageData}}));
            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setData(prev => ({...prev, profile: {...prev.profile, image: file}}));
                });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routing = edit ? route('student.resume.update') : route('student.resume.store');

        post(routing, {
            onSuccess: () => {
                console.log(edit ? 'Resume updated successfully' : 'Resume created successfully');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            forceFormData: true
        });
    };

    const addItem = (section: keyof ResumeFormData) => {
        if (Array.isArray(formData[section])) {
            setData(prev => ({
                ...prev,
                [section]: [...(prev[section] as any[]), getEmptyItem(section)]
            }));
        }
    };

    const getEmptyItem = (section: keyof ResumeFormData) => {
        switch (section) {
            case 'education':
                return { school: '', education_level: '', start_date: '', end_date: '' };
            case 'experiences':
                return { activity: '', position: '', start_date: '', end_date: '' };
            case 'certifications':
                return { certification: '', date_of_issue: '' };
            case 'skills':
                return { skill: '', level: '' };
            case 'soft_skills':
                return { soft_skill: '', level: '' };
            case 'languages':
                return { language: '', level: '' };
            default:
                return {};
        }
    };

    return (
        <StudentLayout>
            <Head title={edit ? "Edit Resume" : "Create Resume"} />
            <div className="flex flex-col w-full pb-10">
                <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                    <div className="flex flex-row md:flex-row items-start md:items-center justify-between px-1 md:px-6 py-2 gap-4">
                        <div id="resume-builder-title" className="flex flex-row items-center justify-between w-full gap-x-4">
                            <div className="flex flex-row items-center gap-x-4">
                                <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                    <Medal className="size-5 md:size-6 text-emerald-600" />
                                </span>
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Resume Builder</h1>
                                    <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                        Build your resume to apply for jobs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                        <TabsList className="relative grid h-9 grid-flow-col auto-cols-fr w-fit ml-auto rounded-full
                            border border-emerald-100 bg-white/80 p-1"
                        >
                            <TabsTrigger
                                value="edit"
                                className="grid h-full cursor-pointer place-items-center rounded-full px-6
                                    text-sm font-medium text-emerald-600
                                    data-[state=active]:bg-emerald-500
                                    data-[state=active]:text-white
                                    transition-all duration-200"
                            >
                                Edit Resume
                            </TabsTrigger>
                            <TabsTrigger
                                value="view"
                                className="grid h-full cursor-pointer place-items-center rounded-full px-6
                                    text-sm font-medium text-emerald-600
                                    data-[state=active]:bg-emerald-500
                                    data-[state=active]:text-white
                                    transition-all duration-200"
                            >
                                View Resume
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="edit">
                            <form className="flex flex-col w-full gap-4 mt-6" onSubmit={handleSubmit}>
                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Profile Information</h2>
                                    </div>
                                    <div className="flex flex-col gap-6 p-4">
                                        <div className="w-full flex flex-col md:flex-row gap-6">
                                            <div className="w-full max-w-xs">
                                                <UploadImageField
                                                    label="Profile Photo"
                                                    imagePath={formData.profile.image_preview}
                                                    onImageChange={handleImageChange}
                                                    errorMessage={getErrorMessage(errors as FormErrors, 'profile.image')}
                                                    cropStyle="profile"
                                                />
                                            </div>

                                            <div className="w-full space-y-4">
                                                <FormField
                                                    label="Name"
                                                    value={formData.profile.name}
                                                    onChange={(value) => setData('profile', { ...formData.profile, name: value })}
                                                    errorMessage={getErrorMessage(errors as FormErrors, 'profile.name')}
                                                    disabled={processing}
                                                />
                                                <FormField
                                                    label="Email"
                                                    type="email"
                                                    value={formData.profile.email}
                                                    onChange={(value) => setData('profile', { ...formData.profile, email: value })}
                                                    errorMessage={getErrorMessage(errors as FormErrors, 'profile.email')}
                                                    disabled={processing}
                                                />
                                                <FormField
                                                    label="Phone"
                                                    value={formData.profile.phone}
                                                    onChange={(value) => setData('profile', { ...formData.profile, phone: value })}
                                                    errorMessage={getErrorMessage(errors as FormErrors, 'profile.phone')}
                                                    disabled={processing}
                                                />
                                                <FormField
                                                    label="Address"
                                                    value={formData.profile.address}
                                                    onChange={(value) => setData('profile', { ...formData.profile, address: value })}
                                                    errorMessage={getErrorMessage(errors as FormErrors, 'profile.address')}
                                                    disabled={processing}
                                                    type="textarea"
                                                    className="min-h-[100px] resize-none"
                                                    autoResize
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <FormField
                                                label="Professional Summary"
                                                type="textarea"
                                                value={formData.summary}
                                                onChange={(value) => setData('summary', value)}
                                                errorMessage={getErrorMessage(errors as FormErrors, 'summary')}
                                                disabled={processing}
                                                className="min-h-[100px] resize-none"
                                                autoResize
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Education</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('education')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Education
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.education.map((edu, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.education.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Education {index + 1}</h3>
                                                    {formData.education.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newEducation = formData.education.filter((_, i) => i !== index);
                                                                setData('education', newEducation);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="School"
                                                        value={edu.school}
                                                        onChange={(value) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].school = value;
                                                            setData('education', newEducation);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'education.school', index)}
                                                        disabled={processing}
                                                    />
                                                    <FormField
                                                        label="Education Level"
                                                        value={edu.education_level}
                                                        onChange={(value) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].education_level = value;
                                                            setData('education', newEducation);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'education.education_level', index)}
                                                        disabled={processing}
                                                    />
                                                    <DatePicker
                                                        label="Start Date"
                                                        date={edu.start_date}
                                                        onDateChange={(value) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].start_date = value;
                                                            setData('education', newEducation);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'education.start_date', index)}
                                                        disabled={processing}
                                                    />
                                                    <DatePicker
                                                        label="End Date"
                                                        date={edu.end_date}
                                                        onDateChange={(value) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].end_date = value;
                                                            setData('education', newEducation);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'education.end_date', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Experience</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('experiences')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Experience
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.experiences.map((exp, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.experiences.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Experience {index + 1}</h3>
                                                    {formData.experiences.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newExperience = formData.experiences.filter((_, i) => i !== index);
                                                                setData('experiences', newExperience);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="Activity/Organization"
                                                        value={exp.activity}
                                                        onChange={(value) => {
                                                            const newExperience = [...formData.experiences];
                                                            newExperience[index].activity = value;
                                                            setData('experiences', newExperience);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'experiences.activity', index)}
                                                        disabled={processing}
                                                    />
                                                    <FormField
                                                        label="Position"
                                                        value={exp.position}
                                                        onChange={(value) => {
                                                            const newExperience = [...formData.experiences];
                                                            newExperience[index].position = value;
                                                            setData('experiences', newExperience);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'experiences.position', index)}
                                                        disabled={processing}
                                                    />
                                                    <DatePicker
                                                        label="Start Date"
                                                        date={exp.start_date}
                                                        onDateChange={(value) => {
                                                            const newExperience = [...formData.experiences];
                                                            newExperience[index].start_date = value;
                                                            setData('experiences', newExperience);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'experiences.start_date', index)}
                                                        disabled={processing}
                                                    />
                                                    <DatePicker
                                                        label="End Date"
                                                        date={exp.end_date}
                                                        onDateChange={(value) => {
                                                            const newExperience = [...formData.experiences];
                                                            newExperience[index].end_date = value;
                                                            setData('experiences', newExperience);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'experiences.end_date', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Certifications</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('certifications')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Certification
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.certifications.map((cert, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.certifications.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Certification {index + 1}</h3>
                                                    {formData.certifications.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newCertifications = formData.certifications.filter((_, i) => i !== index);
                                                                setData('certifications', newCertifications);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="Certification Name"
                                                        value={cert.certification}
                                                        onChange={(value) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].certification = value;
                                                            setData('certifications', newCertifications);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'certifications.certification', index)}
                                                        disabled={processing}
                                                    />
                                                    <DatePicker
                                                        label="Date of Issue"
                                                        date={cert.date_of_issue}
                                                        onDateChange={(value) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].date_of_issue = value;
                                                            setData('certifications', newCertifications);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'certifications.date_of_issue', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Skills</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('skills')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Skill
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.skills.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Skill {index + 1}</h3>
                                                    {formData.skills.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newSkills = formData.skills.filter((_, i) => i !== index);
                                                                setData('skills', newSkills);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="Skill"
                                                        value={skill.skill}
                                                        onChange={(value) => {
                                                            const newSkills = [...formData.skills];
                                                            newSkills[index].skill = value;
                                                            setData('skills', newSkills);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'skills.skill', index)}
                                                        disabled={processing}
                                                    />
                                                    <SelectOption
                                                        label="Proficiency Level"
                                                        placeholder="Select level"
                                                        value={skill.level ? skill.level.toLowerCase() : ''}
                                                        onValueChange={(value) => {
                                                            const newSkills = [...formData.skills];
                                                            newSkills[index].level = value;
                                                            setData('skills', newSkills);
                                                        }}
                                                        options={proficiencyLevels}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'skills.level', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Soft Skills</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('soft_skills')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Soft Skill
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.soft_skills.map((softSkill, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.soft_skills.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Soft Skill {index + 1}</h3>
                                                    {formData.soft_skills.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newSoftSkills = formData.soft_skills.filter((_, i) => i !== index);
                                                                setData('soft_skills', newSoftSkills);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="Soft Skill"
                                                        value={softSkill.soft_skill}
                                                        onChange={(value) => {
                                                            const newSoftSkills = [...formData.soft_skills];
                                                            newSoftSkills[index].soft_skill = value;
                                                            setData('soft_skills', newSoftSkills);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'soft_skills.soft_skill', index)}
                                                        disabled={processing}
                                                    />
                                                    <SelectOption
                                                        label="Proficiency Level"
                                                        placeholder="Select level"
                                                        value={softSkill.level ? softSkill.level.toLowerCase() : ''}
                                                        onValueChange={(value) => {
                                                            const newSoftSkills = [...formData.soft_skills];
                                                            newSoftSkills[index].level = value;
                                                            setData('soft_skills', newSoftSkills);
                                                        }}
                                                        options={proficiencyLevels}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'soft_skills.level', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full bg-emerald-50 border border-primary rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Languages</h2>
                                        <Button
                                            type="button"
                                            onClick={() => addItem('languages')}
                                            className="flex items-center gap-2"
                                            disabled={processing}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Add Language
                                        </Button>
                                    </div>
                                    <div className="flex flex-col">
                                        {formData.languages.map((lang, index) => (
                                            <div key={index} className={`flex flex-col items-start p-4 ${formData.languages.length > 1 ? 'border-b border-emerald-200' : ''}`}>
                                                <div className="w-full flex flex-row justify-between">
                                                    <h3 className="text-md font-semibold">Language {index + 1}</h3>
                                                    {formData.languages.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newLanguages = formData.languages.filter((_, i) => i !== index);
                                                                setData('languages', newLanguages);
                                                            }}
                                                            disabled={processing}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        label="Language"
                                                        value={lang.language}
                                                        onChange={(value) => {
                                                            const newLanguages = [...formData.languages];
                                                            newLanguages[index].language = value;
                                                            setData('languages', newLanguages);
                                                        }}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'languages.language', index)}
                                                        disabled={processing}
                                                    />
                                                    <SelectOption
                                                        label="Proficiency Level"
                                                        placeholder="Select level"
                                                        value={lang.level ? lang.level.toLowerCase() : ''}
                                                        onValueChange={(value) => {
                                                            const newLanguages = [...formData.languages];
                                                            newLanguages[index].level = value;
                                                            setData('languages', newLanguages);
                                                        }}
                                                        options={proficiencyLevels}
                                                        errorMessage={getErrorMessage(errors as FormErrors, 'languages.level', index)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <Spinner className="mr-2 text-emerald-900" /> {edit ? 'Updating...' : 'Saving...'}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="mr-2 size-4" /> {edit ? 'Update Resume' : 'Save Resume'}
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="view" className="w-full h-screen">
                            <div className="w-full h-full">
                                <PDFViewer width="100%" height="100%" className="border rounded-lg" key={pdfKey}>
                                    <ResumePDF data={formData} />
                                </PDFViewer>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </StudentLayout>
    );
}
