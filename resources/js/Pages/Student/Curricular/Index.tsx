import { Head, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Button } from '@/shadcn/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import { MapPin, PackageOpen, Pencil, Plus, Trash } from 'lucide-react';
import { Input } from '@/shadcn/components/ui/input';
import { Clock, Check, Grip, Medal, Search, X, LucideIcon, FileCheck2, FileX2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn/components/ui/table"
import { Badge } from "@/shadcn/components/ui/badge"
import { Eye } from "lucide-react"
import { PaginatedData } from '@/types';
import { Curriculum } from '@/types';
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '@/shadcn/components/ui/dialog';
import { useState } from 'react';
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import Form from './Form';
import { ScrollArea, ScrollBar } from "@/shadcn/components/ui/scroll-area"
import { cn } from "@/shadcn/lib/utils";
import Pagination from '@/Components/Pagination';
import CurricularPoints from './CurricularPoints';

interface StatusValue {
    value: string;
    label: string;
    icon: LucideIcon;
}

interface SkillPoints {
    value: Array<{
        name: string;
        description: string;
        points: number;
    }>
}

interface LevelValue {
    value: string;
    label: string;
    icon: LucideIcon;
}

interface IndexProps {
    curriculums: PaginatedData<Curriculum>
    skillPoints: SkillPoints
}

export default function Index({ curriculums, skillPoints }: IndexProps) {

    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | undefined>(undefined);
    const [dialogActionName, setDialogActionName] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'points' | 'list'>('points');

    const statusValue: StatusValue[] = [
        {
            value: 'all', label: 'All', icon: Grip
        },
        {
            value: 'pending', label: 'Pending', icon: Clock
        },
        {
            value: 'approved', label: 'Approved', icon: FileCheck2
        },
        {
            value: 'rejected', label: 'Rejected', icon: FileX2
        }
    ];

    const levelValue = [
        {
            value: 'all', label: 'All', icon: MapPin
        },
        {
            value: 'school', label: 'School', icon: MapPin
        },
        {
            value: 'district', label: 'District', icon: MapPin
        },
        {
            value: 'state', label: 'State', icon: MapPin
        },
        {
            value: 'national', label: 'National', icon: MapPin
        },
        {
            value: 'international', label: 'International', icon: MapPin
        }
    ];

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string | null>(null);
    const handleDeleteClick = (id: number, name: string) => {
        setItemToDelete(id);
        setItemName(name);
        setIsAlertOpen(true);
    };
    const handleDeleteConfirm = () => {
        if (itemToDelete !== null) {
            router.delete(route('student.curricular.destroy', { id: itemToDelete }), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAlertOpen(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedCurriculum(undefined);
            setDialogActionName(null);
        }, 300);
    };

    return (
        <StudentLayout>
            <Head title="Curricular" />
            <div className="flex flex-col w-full pb-10">
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            handleDialogClose();
                        } else {
                            setIsDialogOpen(true);
                        }
                    }}
                >
                    <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-1 md:px-6 py-2 gap-4">
                            <div className="flex flex-row items-center gap-x-4">
                                <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                    <Medal className="size-5 md:size-6 text-emerald-600" />
                                </span>
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Curricular Exchange</h1>
                                    <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                        {activeTab === 'points' ?
                                            'Exchange your curricular into soft skill points.' :
                                            'View your curricular list.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-auto">
                                {activeTab === 'list' && (
                                    <DialogTrigger asChild onClick={() => {
                                        setDialogActionName('add');
                                        setIsDialogOpen(true);
                                    }}>
                                    <Button className="w-full md:w-auto">
                                        <Plus className="size-4" />
                                        Add Curricular
                                    </Button>
                                </DialogTrigger>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-1 px-1 md:px-6 mb-4">
                            <button
                                onClick={() => setActiveTab('points')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg focus:outline-none",
                                    activeTab === 'points'
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                )}
                            >
                                Curricular Points
                            </button>
                            <button
                                onClick={() => setActiveTab('list')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg focus:outline-none",
                                    activeTab === 'list'
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                )}
                            >
                                List of Curricular
                            </button>
                        </div>
                        {activeTab === 'points' ? (
                            <div id="curricular-points" className="px-1 md:px-6">
                                <CurricularPoints skillPoints={skillPoints} />
                            </div>
                        ) : (
                            <div id="curricular-list">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-3 px-1 md:px-6 py-2 pb-5">
                                    <div className="relative w-full md:max-w-sm">
                                        <Input
                                            type="text"
                                            placeholder="Search..."
                                            className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                        />
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                    </div>
                                    <div className="flex flex-row gap-2 w-full md:w-auto">
                                        <Select>
                                            <SelectTrigger className="w-full md:w-[180px] bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                                <SelectValue placeholder="Status Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="text-emerald-500 font-bold">{"Status"}</SelectLabel>
                                                    {statusValue.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            <div className="flex flex-row items-center justify-start gap-2">
                                                                <status.icon className="h-4 w-4 text-emerald-500" />
                                                                <span className="text-emerald-500">{status.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-row gap-2 w-full md:w-auto">
                                        <Select>
                                            <SelectTrigger className="w-full md:w-[180px] bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                                <SelectValue placeholder="Level Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="text-emerald-500 font-bold">{"Level"}</SelectLabel>
                                                    {levelValue.map((level) => (
                                                        <SelectItem key={level.value} value={level.value}>
                                                            <div className="flex flex-row items-center justify-start gap-2">
                                                                <level.icon className="h-4 w-4 text-emerald-500" />
                                                                <span className="text-emerald-500">{level.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full px-1 md:px-6">
                                    <div className="w-full">
                                        {/* Desktop View */}
                                        <div className="hidden md:block border border-emerald-200 rounded-lg overflow-hidden">
                                            <ScrollArea className="w-full rounded-lg">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-emerald-500/80 hover:bg-emerald-500/40 transition-colors">
                                                            <TableHead className="text-emerald-700 font-bold w-[60px]">No</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[300px]">Curricular Details</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[120px]">Type</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[100px]">Document</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[100px]">Status</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[100px]">Level</TableHead>
                                                            <TableHead className="text-emerald-700 font-bold w-[120px]">Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {curriculums && curriculums.data.length > 0 ? (
                                                            curriculums.data.map((curriculum: Curriculum, index: number) => (
                                                                <TableRow
                                                                    key={curriculum.id}
                                                                    className="hover:bg-emerald-50 transition-colors"
                                                                >
                                                                    <TableCell className="text-emerald-600 ps-1">{index + 1}</TableCell>
                                                                    <TableCell className="font-medium text-emerald-700">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-emerald-700 font-bold">{curriculum.name}</span>
                                                                            <span className="text-emerald-600 text-xs">{curriculum.description}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium text-emerald-700">
                                                                        {curriculum.type === 'certificates' ?
                                                                            <span className="px-4 py-1 rounded-full bg-sky-100 border border-sky-500 text-sky-500">Certificates</span> :
                                                                            <span className="px-4 py-1 rounded-full bg-violet-100 border border-violet-500 text-violet-500">Activities</span>
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border-emerald-600 hover:bg-emerald-600/50 hover:text-emerald-50"
                                                                            onClick={() => window.open(curriculum.document_url, '_blank')}
                                                                        >
                                                                            <Eye className="h-3 w-3" />
                                                                            View
                                                                        </Button>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {curriculum.status === 'pending' && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border-emerald-500 text-emerald-700 bg-emerald-50 text-xs"
                                                                            >
                                                                                {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                            </Badge>
                                                                        )}
                                                                        {curriculum.status === 'approved' && (
                                                                            <Badge
                                                                                className="bg-emerald-500 hover:bg-emerald-600"
                                                                            >
                                                                                {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                            </Badge>
                                                                        )}
                                                                        {curriculum.status === 'rejected' && (
                                                                            <Badge
                                                                                variant="destructive"
                                                                                className="bg-red-500 hover:bg-red-600"
                                                                            >
                                                                                {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="capitalize text-emerald-600">{curriculum.level}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <DialogTrigger asChild key={curriculum.id + 'edit'} onClick={() => {
                                                                                setDialogActionName('edit');
                                                                                setSelectedCurriculum(curriculum);
                                                                                setIsDialogOpen(true);
                                                                            }}>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 px-2 text-sky-600 bg-sky-50 border-sky-600 hover:bg-sky-50 hover:text-sky-700"
                                                                                >
                                                                                    <Pencil className="h-3 w-3" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleDeleteClick(curriculum.id, curriculum.name)}
                                                                                className="h-8 px-2 text-red-600 bg-red-100 border-red-600 hover:bg-red-50 hover:text-red-700"
                                                                            >
                                                                                <Trash className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={7} className="text-center text-emerald-600">
                                                                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                                                                        <PackageOpen className="size-12 text-emerald-500" />
                                                                        <p className="text-pretty font-bold text-lg text-emerald-900">No Curricular Found</p>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </div>

                                        {/* Mobile View */}
                                        <div className="space-y-4 md:hidden">
                                            {curriculums && curriculums.data.length > 0 ? (
                                                curriculums.data.map((curriculum: Curriculum, index: number) => (
                                                    <div
                                                        key={curriculum.id}
                                                        className="bg-emerald-100 border border-emerald-200 rounded-lg p-3 space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <span className="text-sm font-bold text-emerald-600 shrink-0">{index + 1}.</span>
                                                                <h3 className="font-semibold text-emerald-700 truncate">{curriculum.name}</h3>
                                                            </div>
                                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                <DialogTrigger asChild onClick={() => {
                                                                    setDialogActionName('edit');
                                                                    setSelectedCurriculum(curriculum);
                                                                    setIsDialogOpen(true);
                                                                }}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0 text-sky-600 bg-sky-50 border-sky-600 hover:bg-sky-50 hover:text-sky-700"
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleDeleteClick(curriculum.id, curriculum.name)}
                                                                    className="h-7 w-7 p-0 text-red-600 bg-red-100 border-red-600 hover:bg-red-50 hover:text-red-700"
                                                                >
                                                                    <Trash className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 text-xs">
                                                            <div className="flex items-center">
                                                                {curriculum.status === 'pending' && (
                                                                    <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                    </Badge>
                                                                )}
                                                                {curriculum.status === 'approved' && (
                                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">
                                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                    </Badge>
                                                                )}
                                                                {curriculum.status === 'rejected' && (
                                                                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-xs">
                                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center border border-emerald-600 rounded-md px-2 py-0.5">
                                                                <span className="capitalize text-emerald-600">{curriculum.level}</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-sm text-emerald-600 line-clamp-2">
                                                            {curriculum.description}
                                                        </div>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 text-xs text-emerald-600 border-emerald-600 hover:bg-emerald-50 w-full"
                                                            onClick={() => window.open(curriculum.document_url, '_blank')}
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            View Document
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-emerald-600 py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <PackageOpen className="size-10 md:size-12 text-emerald-500" />
                                                        <p className="text-pretty font-bold text-base md:text-lg text-emerald-900">No Curricular Found</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                    {curriculums && curriculums.meta && (
                                        <div className="flex items-center justify-center mt-8">
                                            <Pagination meta={curriculums.meta} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <DestructiveAlert
                        isOpen={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                        onConfirm={handleDeleteConfirm}
                        itemId={itemToDelete}
                        name={itemName}
                        withIcon={true}
                    />
                    <DialogContent className="max-w-full h-screen overflow-y-auto bg-emerald-50 rounded-none">
                        <DialogHeader className="mb-0 pb-0">
                            <DialogTitle className="text-emerald-900">
                                {dialogActionName === 'add' ? 'Add' : 'Edit'} Curricular
                            </DialogTitle>
                            <DialogDescription className="text-slate-700">
                                {dialogActionName === 'add' ? 'Add your curricular' : 'Edit your curricular'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] h-[80vh] rounded-lg px-8 py-4 border border-primary overflow-y-auto">
                            <div className="w-full min-h-[80vh] bg-emerald-100/50 border border-primary rounded-lg px-6 py-4">
                                {isDialogOpen && (
                                    <Form
                                        mode={dialogActionName === 'add' ? 'create' : 'edit'}
                                        curriculum={selectedCurriculum}
                                        onClose={handleDialogClose}
                                    />
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </StudentLayout>
    );
}
