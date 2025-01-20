import { FormField } from '@/Components/shadcn/Form/Components';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Register" />
            <div className="flex flex-col space-y-1 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-green-600">Create an account</h1>
                <p className="text-sm text-emerald-300">Enter your details to create an account</p>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        label="First Name"
                        type="text"
                        value={data.first_name}
                        className="mt-1 block w-full"
                        autoComplete="first_name"
                        isFocused={true}
                        onChange={e => setData('first_name', e)}
                        errorMessage={errors.first_name}
                        disabled={processing}
                        required
                    />

                    <FormField
                        label="Last Name"
                        type="text"
                        value={data.last_name}
                        className="mt-1 block w-full"
                        autoComplete="last_name"
                        isFocused={true}
                        onChange={e => setData('last_name', e)}
                        errorMessage={errors.last_name}
                        disabled={processing}
                        required
                    />
                </div>

                <div className="mt-4">
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
                        autoComplete="new-password"
                        onChange={e => setData('password', e)}
                        errorMessage={errors.password}
                        disabled={processing}
                        required
                    />
                </div>

                <div className="mt-4">
                    <FormField
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={e => setData('password_confirmation', e)}
                        errorMessage={errors.password_confirmation}
                        disabled={processing}
                        required
                    />
                </div>

                <div className="mt-8 flex flex-col gap-2 items-start justify-end">
                    <div className="w-full flex flex-row items-center justify-between gap-2">
                        <Link
                            href={route('register.teacher')}
                            className="rounded-md text-sm text-emerald-600 underline hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Register as a teacher
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-md text-sm text-emerald-600 underline hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Already registered?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={processing} className={buttonVariants({ variant: 'default', size: 'lg', className: 'w-full' })} data-pan="register-event">
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="mr-2 text-emerald-900" /> Registering...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 font-bold">
                                <UserPlus className="mr-2 size-6" /> Register
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
