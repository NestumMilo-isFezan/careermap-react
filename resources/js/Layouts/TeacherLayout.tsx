import { PropsWithChildren, useState } from 'react';
import { SidebarProvider } from "@/shadcn/components/ui/sidebar"
import { TeacherSidebar } from "@/Components/shadcn/TeacherSidebar"
import { Separator } from "@/shadcn/components/ui/separator"
import React from 'react'
import { RatingModal } from '@/Components/shadcn/RatingModal';
import { ReportBugModal } from '@/Components/shadcn/ReportBug';
import Footer from '@/Components/Footer';

export default function Teacher({ children, title }: PropsWithChildren & { title: string }) {
    const [open, setOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen-teacher');
        return saved ? JSON.parse(saved) : false;
    });
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isReportBugModalOpen, setIsReportBugModalOpen] = useState(false);

    // Handle drawer state changes
    const handleOpenDrawerChange = (newOpen: boolean) => {
        setOpen(newOpen);
        localStorage.setItem('sidebarOpen-teacher', JSON.stringify(newOpen));
    };

    const openRatingModal = () => {
        setIsRatingModalOpen(true);
    }

    const closeRatingModal = () => {
        setIsRatingModalOpen(false);
    }

    const openReportBugModal = () => {
        setIsReportBugModalOpen(true);
    }

    const closeReportBugModal = () => {
        setIsReportBugModalOpen(false);
    }

    return (
        <SidebarProvider open={open} onOpenChange={handleOpenDrawerChange}>
            <TeacherSidebar
                openRatingModal={openRatingModal}
                openReportBugModal={openReportBugModal}
            />
            <main className="flex flex-col flex-1">
                <div className="flex flex-col flex-1 px-8 py-4 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                    {children}
                </div>
                <Footer />
            </main>

            {isRatingModalOpen && (
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={closeRatingModal}
                />
            )}

            {isReportBugModalOpen && (
                <ReportBugModal
                    isOpen={isReportBugModalOpen}
                    onClose={closeReportBugModal}
                />
            )}
        </SidebarProvider>
    );
}
