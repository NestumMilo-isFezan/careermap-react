import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import StudentLayout from '@/Layouts/StudentLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Edit({
    mustVerifyEmail,
    status,
    userRoles,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; userRoles: number }>) {
    if (userRoles === 1) {
        return (
            <AdminLayout title="Profile">
                <Head title="Profile" />
            </AdminLayout>
        );
    }
    if (userRoles === 2) {
        return (
            <TeacherLayout title="Profile">
                <Head title="Profile" />
            </TeacherLayout>
        );
    }
    return (
        <StudentLayout>
            <Head title="Edit Profile" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
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
