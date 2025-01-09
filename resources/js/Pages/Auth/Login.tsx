import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';

import { FormField } from '@/Components/shadcn/Form/Components';
import { Button } from '@/shadcn/components/ui/button';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LogIn } from 'lucide-react';
import { Spinner } from '@/shadcn/components/ui/spinner';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-green-600">Sign in</h1>
                <p className="text-sm text-emerald-300">Enter your details to sign in</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <FormField
                        label="Email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        onChange={e => setData('email', e)}
                        errorMessage={errors.email}
                        disabled={processing}
                        required
                    />
                </div>


                <div className="mt-4">
                    <FormField
                        label="Password"
                        type="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={e => setData('password', e)}
                        errorMessage={errors.password}
                        disabled={processing}
                        required
                    />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-6 w-full flex flex-col gap-2 items-start">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" disabled={processing} className="w-full" size="lg">
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="mr-2 text-emerald-900" /> Logging in...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 font-bold">
                                <LogIn className="mr-2 size-6" /> Log in
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
