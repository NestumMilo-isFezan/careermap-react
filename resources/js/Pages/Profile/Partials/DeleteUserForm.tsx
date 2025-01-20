import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { FormField } from '@/Components/shadcn/Form/Components';
import TextInput from '@/Components/TextInput';
import { Button } from '@/shadcn/components/ui/button';
import { Spinner } from '@/shadcn/components/ui/spinner';
import { useForm } from '@inertiajs/react';
import { Trash, UserRoundX } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className="w-full flex flex-col">
            <header>
                <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 px-6 py-2">
                    <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between px-1 gap-4">
                        <div className="flex flex-row items-center gap-x-4">
                            <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                <UserRoundX className="size-5 md:size-6 text-emerald-600" />
                            </span>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Delete Account</h1>
                                <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-row justify-center lg:justify-end items-center gap-2 lg:px-8">
                        <DangerButton onClick={confirmUserDeletion}>
                            Delete Account
                        </DangerButton>
                    </div>
                </div>
            </header>



            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-red-900">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-red-600">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-6">
                        <FormField
                            label="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e)}
                            required
                            autoComplete="new-password"
                            errorMessage={errors.password}
                            type="password"
                            placeholder="Password"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button onClick={closeModal} variant="outline" className="bg-rose-200 border border-rose-500 text-rose-900 hover:bg-rose-300 hover:border-rose-600 hover:text-rose-950">
                            Cancel
                        </Button>

                        <Button type="submit" disabled={processing} className="bg-red-500 border border-red-600 text-white hover:bg-red-600 hover:border-red-700 hover:text-white">
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Spinner className="mr-2 text-red-900" /> Deleting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trash className="mr-2 size-4" /> Delete
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
