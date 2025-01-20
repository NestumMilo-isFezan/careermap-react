import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Button } from '@/shadcn/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Save, UserCog } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';
import { FormField } from '@/Components/shadcn/Form/Components';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className="w-full flex flex-col">
            <header>
                <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 gap-4">
                        <div className="flex flex-row items-center gap-x-4">
                            <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                <UserCog className="size-5 md:size-6 text-emerald-600" />
                            </span>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Update Password</h1>
                                <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <form onSubmit={updatePassword} className="w-full mt-4 space-y-6 mb-8">
                <div className="w-full flex flex-col gap-2 md:px-8">
                    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-xl pb-2 md:pb-6">
                        <FormField
                            label="Current Password"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e)}
                            required
                            autoComplete="current-password"
                            errorMessage={errors.current_password}
                            type="password"
                            placeholder="Current Password"
                        />
                        <FormField
                            label="New Password"
                            value={data.password}
                            onChange={(e) => setData('password', e)}
                            required
                            autoComplete="new-password"
                            errorMessage={errors.password}
                            type="password"
                            placeholder="New Password"
                        />
                        <FormField
                            label="Confirm Password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e)}
                            required
                            autoComplete="new-password"
                            errorMessage={errors.password_confirmation}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </div>

                    <div className="w-full pt-4 px-8 flex flex-row justify-center lg:justify-end">
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
            </form>
        </section>
    );
}
