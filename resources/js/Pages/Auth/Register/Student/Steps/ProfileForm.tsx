import { FormProps } from '@/types/form';
import { ProfileBanner, SubmitButton } from '../WizardFormComponent';
import { DatePicker } from '@/Components/shadcn/Form/Calendar';
import { SelectOption, FormField } from '@/Components/shadcn/Form/Components';
import { Button } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { ArrowRight } from 'lucide-react';

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

interface ProfileFormProps {
    form: FormProps<ProfileFormData>;
    user: any;
    onSubmit: (e: React.FormEvent) => void;
    onImageChange: (imageData: string | File) => void;
}

export default function ProfileForm({ form, user, onSubmit, onImageChange }: ProfileFormProps) {
    const dummyImg = 'https://penguinui.s3.amazonaws.com/component-assets/3d-avatar-1.webp';

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <ProfileBanner
                user={user}
                profileImage={form.data.image ? URL.createObjectURL(form.data.image) : dummyImg}
                onImageChange={onImageChange}
                formMode="create"
                processing={form.processing}
                errorMessage={form.errors.image}
            />

            <div className="flex flex-col gap-6 px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <DatePicker
                        date={form.data.birth_date}
                        onDateChange={(date) => form.setData('birth_date', date)}
                        errorMessage={form.errors.birth_date}
                    />
                    <SelectOption
                        label="Gender"
                        value={form.data.gender}
                        onValueChange={(value) => form.setData('gender', value)}
                        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                        errorMessage={form.errors.gender}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        label="Religion"
                        value={form.data.religion}
                        placeholder="Enter your religion"
                        onChange={(value) => form.setData('religion', value)}
                        autoComplete="religion"
                        required
                        errorMessage={form.errors.religion}
                    />
                    <FormField
                        label="Phone Number"
                        value={form.data.phone}
                        placeholder="Enter your phone number"
                        onChange={(value) => form.setData('phone', value)}
                        autoComplete="phone"
                        required
                        errorMessage={form.errors.phone}
                    />
                </div>

                <FormField
                    label="Address"
                    type="textarea"
                    value={form.data.address}
                    placeholder="Enter your address"
                    onChange={(value) => form.setData('address', value)}
                    autoComplete="address"
                    errorMessage={form.errors.address}
                />

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        label="Postcode"
                        value={form.data.postcode}
                        placeholder="Enter your postcode"
                        onChange={(value) => form.setData('postcode', value)}
                        autoComplete="postal-code"
                        errorMessage={form.errors.postcode}
                    />
                    <FormField
                        label="City"
                        value={form.data.city}
                        placeholder="Enter your city"
                        onChange={(value) => form.setData('city', value)}
                        autoComplete="city"
                        errorMessage={form.errors.city}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        label="State"
                        value={form.data.state}
                        placeholder="Enter your state"
                        onChange={(value) => form.setData('state', value)}
                        autoComplete="state"
                        errorMessage={form.errors.state}
                    />
                    <FormField
                        label="Country"
                        value={form.data.country}
                        placeholder="Enter your country"
                        onChange={(value) => form.setData('country', value)}
                        autoComplete="country"
                        errorMessage={form.errors.country}
                    />
                </div>
            </div>

            <div className="flex justify-center p-4">
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
    );
}
