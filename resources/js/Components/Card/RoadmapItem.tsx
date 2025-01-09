import { Roadmap } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { MapPin } from 'lucide-react'
import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/components/ui/card";


import { useState } from "react";
import RoadmapIcon from "./RoadmapIcon";

interface Props {
    roadmap: Roadmap,
    onDelete?: (id: number) => void,
}

export default function RoadmapItem({roadmap, onDelete}: Props) {
    const fixedDescription = roadmap.description.substring(0, 100) + '...';
    const maxHeight = "max-h-[25rem]";
    const minHeight = "min-h-[12rem]";

    const recommendationPercentage = roadmap.recommendation_score ? roadmap.recommendation_score : 0;

    const user = usePage().props.auth.user ? usePage().props.auth.user : null;

    return (
        <>
        <Card className="max-w-sm overflow-hidden group bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700">
          <div className={`h-44 md:h-64 overflow-hidden ${maxHeight}`}>
            <img
              src={roadmap.image}
              alt={roadmap.title}
              className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-1 font-medium">
              <RoadmapIcon domain={roadmap.domain_name} className="size-5" />
              <span>{roadmap.domain_name}</span>
            </div>
          </CardHeader>
          <CardContent className={`p-6 pt-4 pb-0 ${minHeight}`}>
            <h3 className="text-balance text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-4 line-clamp-2" aria-describedby="roadmapDescription">
              {roadmap.title}
            </h3>
            <p id="roadmapDescription" className="text-pretty text-sm mb-6">
              {fixedDescription}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0 gap-4">
            {user?.role === 1 && (
                <div className="grid grid-cols-2 w-full gap-4">
                    <Button>
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete?.(roadmap.id)}>
                        Delete
                    </Button>
                </div>
            )}
            {user?.role === 0 && (
                <div className="flex flex-row items-start w-full gap-2">
                    {recommendationPercentage === 0 ? (
                        <span className="w-full text-sm text-neutral-500">
                            No recommendation
                        </span>
                    ) : (
                        <>
                            {recommendationPercentage <= 40 && (
                                <span className="w-full text-sm text-red-500">
                                    Not Recommended
                                </span>
                            )}
                            {recommendationPercentage > 40 && recommendationPercentage <= 60 && (
                                <span className="w-full text-sm text-yellow-500">
                                    Least Recommended
                                </span>
                            )}
                            {recommendationPercentage > 60 && (
                                <span className="w-full text-sm text-green-500">
                                    Recommended
                                </span>
                            )}
                        </>
                    )}
                </div>
            )}
          </CardFooter>
        </Card>
        </>

    )
}
