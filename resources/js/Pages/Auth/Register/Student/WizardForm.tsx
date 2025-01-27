import { useState } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';
import { ProgressSteps } from './WizardFormComponent';
import ProfileForm from './Steps/ProfileForm';
import StudentDetailsForm from './Steps/StudentDetailsForm';
import GradeForm from './Steps/GradeForm';
import { Subject } from '@/types/form';

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

interface StudentFormData {
    school_id: number;
    stream_id: number;
    classroom_id: number;
}

interface GradeFormData {
    grades: Array<{
        subject_id: number;
        grade: string;
    }>;
}

interface WizardFormProps {
    user: any;
    initialStep?: number;
    queryParams?: any;
    streams?: any[];
    schools?: any[];
    classrooms?: any[];
    coreSubjects?: Subject[];
    streamSubjects?: Subject[];
    optionalSubjects?: Subject[];
    stream?: string;
}

export default function WizardForm({
    user,
    initialStep = 1,
    queryParams = null,
    streams = [],
    schools = [],
    classrooms = [],
    coreSubjects = [],
    streamSubjects = [],
    optionalSubjects = [],
    stream = ''
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

    const studentForm = useForm<StudentFormData>({
        school_id: 0,
        stream_id: 0,
        classroom_id: 0,
    });

    const gradesForm = useForm<GradeFormData>({
        grades: [],

    });

    queryParams = queryParams ?? {};

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('guest.register.students.profile.store'), {
            onSuccess: () => {
                setStep(2);
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        studentForm.post(route('guest.register.students.details.store'), {
            onSuccess: () => {
                setStep(3);
            },
        });
    };

    const handleGradesSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if all required grades are filled
        const requiredSubjects = [...coreSubjects];
        const areAllGradesFilled = requiredSubjects.every(subject =>
            gradesForm.data.grades.some(grade =>
                grade.subject_id === subject.id && grade.grade
            )
        );

        if (!areAllGradesFilled) {
            return; // Don't submit if not all grades are filled
        }

        gradesForm.post(route('guest.register.students.grade.store'), {
            onSuccess: () => {
                router.visit(route('home'));
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
                            <StudentDetailsForm
                                form={studentForm}
                                schools={schools}
                                streams={streams}
                                classrooms={classrooms}
                                queryParams={queryParams}
                                onSubmit={handleStudentSubmit}
                            />
                        )}

                        {step === 3 && (
                            <GradeForm
                                form={gradesForm}
                                coreSubjects={coreSubjects}
                                streamSubjects={streamSubjects}
                                optionalSubjects={optionalSubjects}
                                streamName={stream}
                                onSubmit={handleGradesSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </WizardLayout>
    );
}
