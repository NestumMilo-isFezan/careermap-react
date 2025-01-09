import StudentLayout from '@/Layouts/StudentLayout';

import { useState, useEffect, useCallback } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { PaginatedData, Roadmap, Domain } from '@/types';

// Icons
import { Grip, Search, ThumbsUp, ThumbsDown, X, PackageOpen } from 'lucide-react';

// Components
import Pagination from '@/Components/Pagination';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import RoadmapIcon from '@/Components/Card/RoadmapIcon';
import RoadmapItem from '@/Components/Card/RoadmapItem';

import '@xyflow/react/dist/style.css';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  }from '@/shadcn/components/ui/dialog';

export default function Index({ roadmaps, domains, queryParams = null }: { roadmaps: PaginatedData<Roadmap>, domains: Domain[], queryParams: any }) {
    queryParams = queryParams ?? {};
    const searchFieldChanged = (field: string, value: string) => {
        if(value) {
            if(value === '0' || value === '' || value === 'all') {
                delete queryParams[field];
            }
            else{
                queryParams[field] = value;
            }
        }
        else{
            delete queryParams[field];
        }
        delete queryParams['page'];
        router.get(route('student.roadmap.index'), queryParams, { preserveState: true, preserveScroll: true });
    };
    const onKeyPress = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;
        searchFieldChanged(field, e.currentTarget.value);
    }
    const clearDomainFilter = () => {
        setDomainFilter('0');
        delete queryParams['domain_id'];
        delete queryParams['page'];
        router.get(route('student.roadmap.index'), queryParams, { preserveState: true, preserveScroll: true });
    }
    const clearRecommendationFilter = () => {
        setRecommendationFilter('all');
        delete queryParams['recommendation'];
        delete queryParams['page'];
        router.get(route('student.roadmap.index'), queryParams, { preserveState: true, preserveScroll: true });
    }
    const [domainFilter, setDomainFilter] = useState('0');
    const [recommendationFilter, setRecommendationFilter] = useState('all');
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

    return (
        <StudentLayout>
            <Head title="Roadmaps" />
            <Dialog open={selectedRoadmap !== null} onOpenChange={(open) => !open && setSelectedRoadmap(null)}>
                <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="flex flex-row items-center justify-start gap-3 px-6 py-2 pb-5">
                            <div className="relative w-full max-w-sm">
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                    onBlur={ (e) => searchFieldChanged('name', e.target.value)}
                                    onKeyDown={ (e) => onKeyPress('name', e)}
                                />
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                            </div>
                            <div className="flex flex-row gap-2 w-full max-w-xs">
                                <Select
                                    value={domainFilter}
                                    onValueChange={ (e) => { setDomainFilter(e); searchFieldChanged('domain_id', e) } }
                                >
                                    <SelectTrigger className="bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                        <SelectValue placeholder="Domain Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel className="text-emerald-500 font-bold">{"Domain Name (Field of Study)"}</SelectLabel>
                                            <SelectItem value="0">
                                                <div className="flex flex-row items-center justify-start gap-2">
                                                    <Grip className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-500">{"All Domains"}</span>
                                                </div>
                                            </SelectItem>
                                            {domains && domains.map((domain : Domain) => (
                                                <SelectItem key={domain.id} value={domain.id.toString()}>
                                                    <div className="flex flex-row items-center justify-start gap-2">
                                                        <RoadmapIcon domain={domain.name} className="size-4 text-emerald-500" />
                                                        <span className="text-emerald-500">{domain.name}</span>
                                                    </div>
                                                </SelectItem>)
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {domainFilter !== '0' && (
                                    <Button onClick={clearDomainFilter} variant="destructive">
                                        <X />
                                    </Button>
                                )}
                            </div>
                            <div className="flex flex-row gap-2 w-full max-w-xs">
                                <Select
                                    value={recommendationFilter}
                                    onValueChange={ (e) => { setRecommendationFilter(e); searchFieldChanged('recommendation', e) } }
                                >
                                    <SelectTrigger className="bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                        <SelectValue placeholder="Recommendation Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel className="text-emerald-500 font-bold">{"Recommendation Filter"}</SelectLabel>
                                            <SelectItem value="all">
                                                <div className="flex flex-row items-center justify-start gap-2">
                                                    <Grip className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-500">{"All"}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="recommended">
                                                <div className="flex flex-row items-center justify-start gap-2">
                                                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-500">{"Recommended"}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="not_recommended">
                                                <div className="flex flex-row items-center justify-start gap-2">
                                                    <ThumbsDown className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-500">{"Not Recommended"}</span>
                                                </div>
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {recommendationFilter !== 'all' && (
                                    <Button onClick={clearRecommendationFilter} variant="destructive">
                                        <X />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* <div>
                            <pre>{JSON.stringify(roadmaps, null, 2)}</pre>
                        </div> */}
                        {roadmaps && roadmaps.data.length > 0 ? (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-6 py-2">
                                    {roadmaps.data.map((roadmap: Roadmap) => (
                                        <DialogTrigger key={roadmap.id} asChild onClick={() => setSelectedRoadmap(roadmap)}>
                                            <div className="cursor-pointer">
                                                <RoadmapItem roadmap={roadmap} />
                                            </div>
                                        </DialogTrigger>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center mt-8">
                                    <Pagination meta={roadmaps.meta} />
                                </div>
                                </>
                            ) : (
                                <div className="flex flex-col min-h-[22rem] items-center justify-center py-4">
                                    <PackageOpen className="size-12 text-emerald-500" />
                                    <p className="text-pretty text-sm text-emerald-900">No Roadmap Found</p>
                                </div>
                            )
                        }
                    </div>
                    <DialogContent className="max-w-[100vw] h-[100vh] p-0">
                        <DialogHeader className="p-6">
                            <DialogTitle>{selectedRoadmap?.title}</DialogTitle>
                            <DialogDescription>
                                View roadmap details
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 p-6">
                            {/* Add your roadmap content here */}
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
        </StudentLayout>
    );
}
