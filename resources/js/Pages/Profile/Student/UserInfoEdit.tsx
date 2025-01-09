import PrimaryButton from '@/Components/PrimaryButton';
import { DatePicker } from '@/Components/shadcn/Form/Calendar';
import { FormField, SelectOption } from '@/Components/shadcn/Form/Components';
import { UploadImageField } from '@/Components/shadcn/Form/UploadField';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Button } from '@/shadcn/components/ui/button';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';


export interface ProfileFormData {
    _method: string;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    religion: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    image: File | null;
    preview_image: string;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const profile = usePage().props.auth.profile;

    const { data, setData, errors, processing, post, reset } =
        useForm<ProfileFormData>({
            _method: 'put',
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            birth_date: profile?.birth_date || '',
            gender: profile?.gender || 'male',
            religion: profile?.religion || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            city: profile?.city || '',
            state: profile?.state || '',
            postcode: profile?.postcode || '',
            country: profile?.country || '',
            image: null,
            preview_image: user?.image || '',
        });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    const handleImageChange = (imageData: string | File) => {
        if (imageData instanceof File) {
            setData('image', imageData);
            const previewUrl = URL.createObjectURL(imageData);
            setData('preview_image', previewUrl);
        } else {
            setData('preview_image', imageData);
            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setData('image', file);
                });
        }
    };

    return (
        <section className="w-full flex flex-col">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-4xl pb-2 md:pb-6">
                        {/* Profile Information - Left Column */}
                        <div className="flex flex-col w-1/2 items-center">
                            <div className="flex flex-col justify-center items-center max-w-48">
                                <UploadImageField
                                    imagePath={data.preview_image}
                                    onImageChange={handleImageChange}
                                    errorMessage={errors.image}
                                    cropStyle="profile"
                                    circle={true}
                                />
                            </div>
                        </div>

                        {/* Profile Information - Middle Column */}
                        <div className="flex flex-col gap-2 w-full max-w-xl">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <FormField
                                    label="First Name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e)}
                                    required
                                    autoComplete="first_name"
                                    errorMessage={errors.first_name}
                                />
                                <FormField
                                    label="Last Name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e)}
                                    required
                                    autoComplete="last_name"
                                    errorMessage={errors.last_name}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-4 w-full">
                                <DatePicker
                                    label="Birth Date"
                                    date={data.birth_date}
                                    onDateChange={(e) => setData('birth_date', e)}
                                    errorMessage={errors.birth_date}
                                />
                                <SelectOption
                                    label="Gender"
                                    value={data.gender}
                                    onValueChange={(e) => setData('gender', e)}
                                    options={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                    ]}
                                    errorMessage={errors.gender}
                                />
                                <FormField
                                    label="Religion"
                                    value={data.religion}
                                    onChange={(e) => setData('religion', e)}
                                    autoComplete="religion"
                                    errorMessage={errors.religion}
                                />
                                <FormField
                                    label="Phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e)}
                                    required
                                    autoComplete="phone"
                                    errorMessage={errors.phone}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-4xl">
                        <div className="w-full">
                            <FormField
                                label="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e)}
                                required
                                autoComplete="email"
                                errorMessage={errors.email}
                                disabled
                            />
                        </div>
                        <div className="w-full">
                            <FormField
                                label="Address"
                                value={data.address}
                                onChange={(e) => setData('address', e)}
                                required
                                type="textarea"
                                autoComplete="address"
                                errorMessage={errors.address}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                            <FormField
                                label="Postcode"
                                value={data.postcode}
                                onChange={(e) => setData('postcode', e)}
                                required
                                autoComplete="postcode"
                                errorMessage={errors.postcode}
                            />
                            <FormField
                                label="City"
                                value={data.city}
                                onChange={(e) => setData('city', e)}
                                required
                                autoComplete="city"
                                errorMessage={errors.city}
                            />
                            <FormField
                                label="State"
                                value={data.state}
                                onChange={(e) => setData('state', e)}
                                required
                                autoComplete="state"
                                errorMessage={errors.state}
                            />
                            <FormField
                                label="Country"
                                value={data.country}
                                onChange={(e) => setData('country', e)}
                                required
                                autoComplete="country"
                                errorMessage={errors.country}
                            />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-gray-800">
                                    Your email address is unverified.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your
                                        email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="w-full pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner className="mr-2 text-emerald-900" /> Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="mr-2 size-4" /> Save
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

            </form>
        </section>
    );
}
