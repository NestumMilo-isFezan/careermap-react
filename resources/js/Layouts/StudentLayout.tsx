import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import Navbar from '@/Components/Navbar';
import { RatingModal } from '@/Components/shadcn/RatingModal';
import { ReportBugModal } from '@/Components/shadcn/ReportBug';
import Footer from '@/Components/Footer';

export default function Web({ children }: PropsWithChildren) {
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isReportBugModalOpen, setIsReportBugModalOpen] = useState(false);

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
        <div className="min-h-screen flex flex-col flex-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <Navbar
                openRatingModal={openRatingModal}
                openReportBugModal={openReportBugModal}
            />
            <div className="px-6 py-6">
                {children}
            </div>

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

            <Footer />
        </div>
    );
}
