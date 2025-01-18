import StudentLayout from "@/Layouts/StudentLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import { Button } from "@/shadcn/components/ui/button";

interface Props {
    user: User;
}

export default function View({ user }: Props){
    return (
        <StudentLayout>
            <Head title="Resume Builder" />

        </StudentLayout>
    )
}
