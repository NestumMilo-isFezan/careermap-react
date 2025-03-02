import StudentLayout from '@/Layouts/StudentLayout';

import { useState, useEffect, useCallback } from 'react';
import { Head, router, Link, Deferred } from '@inertiajs/react';
import { PaginatedData, Roadmap, Domain, SelectedRoadmap } from '@/types';

// Icons
import { Grip, Search, ThumbsUp, ThumbsDown, X, PackageOpen, MapPin } from 'lucide-react';

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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  }from '@/shadcn/components/ui/dialog';
import ViewModal from './Content/ViewModal';
import RoadmapViewSkeleton from '@/Components/RoadmapViewSkeleton';
import DisplayModal from './Content/DisplayModal';
import { cn } from '@/shadcn/lib/utils';

export default function Index({ roadmaps, domains, queryParams = null, roadmap_item = null }: { roadmaps: PaginatedData<Roadmap>, domains: Domain[], queryParams: any, roadmap_item: SelectedRoadmap | null }) {
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
    const [isViewModalReady, setIsViewModalReady] = useState(false);
    const [activeTab, setActiveTab] = useState<'recommended' | 'favorites'>('recommended');

    const viewRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
    }

    const handleCloseDialog = () => {
        setSelectedRoadmap(null);
    }

    return (
        <StudentLayout>
            <Head title="Roadmaps" />
            <Dialog open={selectedRoadmap !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
                <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full p-4 sm:p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center px-2 sm:px-6 py-2 gap-4">
                            <span className="inline-block p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                <MapPin className="size-6 text-emerald-600" />
                            </span>
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl font-bold text-emerald-800">Roadmaps</h1>
                                <p className="text-emerald-700 text-sm text-justify max-w-lg">
                                    Explore a wide range of career paths and discover the best fit for you.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 px-2 sm:px-6 py-2 pb-5">
                            <div className="relative w-full sm:max-w-sm">
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                    onBlur={ (e) => searchFieldChanged('name', e.target.value)}
                                    onKeyDown={ (e) => onKeyPress('name', e)}
                                />
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                            </div>
                            <div className="flex flex-row gap-2 w-full sm:w-auto">
                                <Select
                                    value={domainFilter}
                                    onValueChange={ (e) => { setDomainFilter(e); searchFieldChanged('domain_id', e) } }
                                >
                                    <SelectTrigger className="w-full sm:w-[200px] bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
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
                            <div className="flex flex-row gap-2 w-full sm:w-auto">
                                <Select
                                    value={recommendationFilter}
                                    onValueChange={ (e) => { setRecommendationFilter(e); searchFieldChanged('recommendation', e) } }
                                >
                                    <SelectTrigger className="w-full sm:w-[200px] bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
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

                        <div className="flex space-x-1 px-2 sm:px-6 mb-4">
                            <button
                                onClick={() => {
                                    setActiveTab('recommended');
                                    delete queryParams['favorites'];
                                    router.get(route('student.roadmap.index'), queryParams, {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg focus:outline-none",
                                    activeTab === 'recommended'
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                )}
                            >
                                Recommended
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('favorites');
                                    queryParams['favorites'] = true;
                                    router.get(route('student.roadmap.index'), queryParams, {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg focus:outline-none",
                                    activeTab === 'favorites'
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                )}
                            >
                                Favorites
                            </button>
                        </div>

                        {roadmaps && roadmaps.data.length > 0 ? (
                            <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-2 sm:px-6 py-2">
                                {roadmaps.data.map((roadmap: Roadmap) => (
                                    <DialogTrigger key={roadmap.id} asChild onClick={() => viewRoadmap(roadmap)}>
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
                        )}
                    </div>

                    <DialogContent className="max-w-[100vw] h-[100vh] p-2 sm:p-4 bg-emerald-50">
                        <DialogHeader className="p-2">
                            <DialogTitle className="text-emerald-900 text-lg sm:text-xl">{selectedRoadmap?.title}</DialogTitle>
                            <DialogDescription className="text-slate-700">
                                View roadmap details
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-emerald-200 border border-primary rounded-lg">
                            <div className="p-2 sm:p-4 h-[80vh] flex flex-row">
                                <DisplayModal id={selectedRoadmap?.id.toString() ?? ''} />
                            </div>
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
        </StudentLayout>
    );
}
