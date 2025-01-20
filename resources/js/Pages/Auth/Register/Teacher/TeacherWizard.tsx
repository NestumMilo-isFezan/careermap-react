import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';
import { ProgressSteps } from './StepIndicator';
import ProfileForm from '@/Pages/Auth/Register/Student/Steps/ProfileForm';
import TeacherDetailsForm from './TeacherDetailsForm';

interface ProfileFormData {
    birth_date: string;
    gender: 'male' | 'female';
    phone: string;
    address: string;
    state: string;
    city: string;
    postcode: string;
    country: string;
    religion: string;
    image: File | null;
    preview_image?: string;
}

interface TeacherFormData {
    classroom_id: number;
}

interface WizardFormProps {
    user: any;
    initialStep?: number;
    classrooms?: any[];
}

export default function WizardForm({
    user,
    initialStep = 1,
    classrooms,

}: WizardFormProps) {
    const [step, setStep] = useState(initialStep);

    const profileForm = useForm<ProfileFormData>({
        birth_date: '',
        gender: 'male',
        phone: '',
        address: '',
        state: '',
        city: '',
        postcode: '',
        country: '',
        religion: '',
        image: null,
    });

    const teacherForm = useForm<TeacherFormData>({
        classroom_id: 0,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('guest.register.teachers.profile.store'), {
            onSuccess: () => {
                setStep(2);
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    const handleTeacherSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        teacherForm.post(route('guest.register.teachers.details.store'), {
            onSuccess: () => {
                setStep(3);
            },
        });
    };


    const handleImageChange = (imageData: string | File) => {
        if (imageData instanceof File) {
            // Handle raw file upload
            profileForm.setData('image', imageData);
            // Create temporary URL for preview
            const previewUrl = URL.createObjectURL(imageData);
            profileForm.setData('preview_image', previewUrl);
        } else {
            // Handle cropped image URL
            profileForm.setData('preview_image', imageData);
            // Convert URL to File if needed for form submission
            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    profileForm.setData('image', file);
                });
        }
    };

    return (
        <WizardLayout>
            <Head title="Register" />
            <div className="w-full py-4 text-center bg-amber-50 border-b border-amber-500 z-10">
                <div className="inline-block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                        Let's Create Your Profile!
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="max-w-4xl mx-auto">
                    <ProgressSteps currentStep={step} />

                    <div className="bg-green-100 border border-emerald-500 rounded-md shadow-sm">
                        {step === 1 && (
                            <ProfileForm
                                form={profileForm}
                                user={user}
                                onSubmit={handleProfileSubmit}
                                onImageChange={handleImageChange}
                            />
                        )}

                        {step === 2 && (
                            <TeacherDetailsForm
                                form={teacherForm}
                                classrooms={classrooms ?? []}
                                onSubmit={handleTeacherSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </WizardLayout>
    );
}
