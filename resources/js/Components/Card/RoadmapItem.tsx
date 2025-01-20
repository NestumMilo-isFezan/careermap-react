import { Roadmap } from "@/types";
import { router, usePage, Link } from "@inertiajs/react";
import { Heart } from 'lucide-react'
import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/components/ui/card";
import { cn } from "@/shadcn/lib/utils";

import RoadmapIcon from "./RoadmapIcon";
import RecommendationBadge from "./RecommendationBadge";

interface Props {
    roadmap: Roadmap,
    onDelete?: (id: number, name: string) => void,
}

export default function RoadmapItem({roadmap, onDelete}: Props) {
    const fixedDescription = roadmap.description.substring(0, 100) + '...';
    const maxHeight = "h-34 md:h-48";
    const minHeight = "min-h-[10rem]";

    const recommendationPercentage = roadmap.recommendation_score ? roadmap.recommendation_score : 0;

    const user = usePage().props.auth.user ? usePage().props.auth.user : null;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (roadmap.is_favorite) {
            router.delete(route('student.roadmap.favorite.destroy', roadmap.id), {
                preserveScroll: true,
            });
        } else {
            router.post(route('student.roadmap.store'), {
                roadmap_id: roadmap.id
            }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
        <Card className="max-w-sm overflow-hidden group bg-yellow-50/50 text-neutral-600 border-emerald-500">
          <div className={`relative h-44 md:h-64 overflow-hidden ${maxHeight}`}>
            <img
              src={roadmap.image}
              alt={roadmap.title}
              className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            {user?.role === 0 && (
              <div className="absolute bottom-4 right-4">
                <RecommendationBadge recommendationPercentage={recommendationPercentage} />
              </div>
            )}
          </div>
          <CardHeader className="p-6 pb-0">
            <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-1 font-medium text-sky-500 py-1 px-2 rounded-full text-sm bg-sky-100/50 border border-sky-500 group-hover:bg-sky-200/70 group-hover:text-sky-700 transition-all duration-300 ease-in-out">
                    <RoadmapIcon domain={roadmap.domain_name} className="size-5" />
                    <span>{roadmap.domain_name}</span>
                </div>

            </div>
          </CardHeader>
          <CardContent className={`p-6 pt-4 pb-0 ${minHeight}`}>
            <h3 className="text-balance text-xl lg:text-2xl font-bold text-neutral-900 mb-4 line-clamp-2" aria-describedby="roadmapDescription">
              {roadmap.title}
            </h3>
            <p id="roadmapDescription" className="text-pretty text-sm mb-6">
              {fixedDescription}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0 gap-4">
            {user?.role === 1 && (
                <div className="grid grid-cols-2 w-full gap-4">
                    <Link href={route('admin.roadmap.edit', roadmap.id)} className={buttonVariants({variant: "outline", className: "bg-sky-300 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-500 hover:border-sky-600"})}>
                        Edit
                    </Link>
                    <Button variant="destructive" onClick={() => onDelete?.(roadmap.id, roadmap.title)}>
                        Delete
                    </Button>
                </div>
            )}
            {user?.role === 0 && (
                <div className="flex justify-end w-full">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleFavoriteClick}
                        className={cn(
                            "h-9 w-9",
                            roadmap.is_favorite
                                ? "bg-pink-100 text-pink-500 border-pink-500 hover:bg-pink-200 hover:text-pink-700"
                                : "bg-slate-100 text-slate-500 border-slate-500 hover:bg-slate-200 hover:text-slate-700"
                        )}
                    >
                        <Heart className={cn(
                            "h-5 w-5",
                            roadmap.is_favorite && "fill-current"
                        )} />
                    </Button>
                </div>
            )}
          </CardFooter>
        </Card>
        </>

    )
}
