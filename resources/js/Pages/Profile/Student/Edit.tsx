import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import TeacherLayout from '@/Layouts/TeacherLayout';
import UpdateProfileInformationForm from '../Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from '../Partials/UpdatePasswordForm';
import DeleteUserForm from '../Partials/DeleteUserForm';
import UserInfoEdit from './UserInfoEdit';

export default function Edit({
    mustVerifyEmail,
    status,
    userRoles,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; userRoles: number }>) {

    return (
        <StudentLayout>
            <Head title="Edit Profile" />
            <div className="py-12">
                <div className="mx-auto w-full space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-emerald-50 p-4 border border-emerald-500 sm:rounded-lg sm:p-8">
                        <UserInfoEdit
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
