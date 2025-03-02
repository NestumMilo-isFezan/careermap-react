import StudentLayout from "@/Layouts/StudentLayout";
import { User } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { useEffect, useState } from "react";
import { NotificationData } from "@/Pages/Admin/Roadmap/Index";
import { Notification } from "@/Components/Notification";
interface Props {
    user: User;
}

export default function Index({ user, }: Props){

    return (
        <StudentLayout>
            <Head title="Resume" />
            <section id="resume_hero" className="px-18 py-12 md:py-0 md:pt-16">
                <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center">
                    <div className="w-full md:max-w-screen-md">
                        <div className="w-full flex flex-col justify-center items-center">
                            <img
                                src="/assets/resume_guy.png"
                                alt="Resume Illustration"
                                className="h-1/2 md:h-[70%] object-contain"
                            />
                            <Link
                                href={route('student.resume.create')}
                                className={buttonVariants({ variant: 'default', size: 'lg', className: 'w-full max-w-xs' })}
                            >
                                Create Resume
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 pt-12 md:pt-0">
                        <div className="flex flex-col space-y-2 items-center md:items-start justify-center">
                            <p className="font-mono text-md font-bold text-sky-500">
                                {'>>'}
                                <span className="text-sky-500">  Create Your </span>
                                <span className="text-white bg-emerald-500/70 px-2 py-1 italic">Resume</span>
                            </p>
                            <div className="flex flex-col items-center justify-center font-cabinet font-extrabold text-6xl">
                                <span className="text-green-500">LIKE A</span>
                                <span className="text-green-500">BOSS...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </StudentLayout>
    )
}
