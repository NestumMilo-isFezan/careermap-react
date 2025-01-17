import { Skeleton } from "@/shadcn/components/ui/skeleton";

export default function RoadmapViewSkeleton() {
    return (
        <div className="bg-emerald-200 border border-primary rounded-lg">
            <div className="p-4 h-[87vh] flex flex-row">
                <div className="w-full max-w-screen-sm h-full flex flex-col pe-4">
                    <Skeleton className="w-full h-[18vh] rounded-lg bg-emerald-900/30" />
                    <div className="w-full max-w-lg flex flex-col gap-4 pt-6 px-2">
                        <Skeleton className="w-2/3 h-[5vh] rounded-lg bg-emerald-900/30" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-full h-[3vh] rounded-lg bg-emerald-900/30" />
                            <Skeleton className="w-full h-[3vh] rounded-lg bg-emerald-900/30" />
                        </div>
                    </div>
                </div>
                <div className="w-full h-full pb-2">
                    <Skeleton className="w-full h-full rounded-lg bg-emerald-900/30" />
                </div>
            </div>
        </div>
    );
}
