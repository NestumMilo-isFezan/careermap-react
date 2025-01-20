import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { PaginatedData, Domain } from '@/types';

// Icons
import { Plus, PackageOpen, Pencil, Trash, School, Phone, Mail, MapPin, X, Check } from 'lucide-react';

// Components
import Pagination from '@/Components/Pagination';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import { Notification, NotificationType } from '@/Components/Notification';
import { ScrollArea, ScrollBar } from '@/shadcn/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shadcn/components/ui/dialog';
import CopyCode from '@/Components/CopyCode';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/ui/avatar';
import CreateEditForm from './CreateEditForm';

export interface NotificationData {
    id: number
    variant: NotificationType
    sender?: {
      name: string
      avatar: string
    }
    title?: string
    message: string
}

export interface SessionMessages {
    add_success?: string | null
    update_success?: string | null
    delete_success?: string | null
    error?: string | null
}

interface School {
    name: string
    image: string
    address: string
    phone: string
    email: string
    referral_code: string
}

interface Classroom {
    id: number
    name: string
    teacher: {
        name: string
        email: string
        phone: string
        image: string
    }
    students: Array<{
        name: string
        email: string
        phone: string
        image: string
        favourite: number
        resume: boolean
    }>
}

export default function Index(
    { school, classrooms }: { school: School, classrooms: PaginatedData<Classroom> }
) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | undefined>(undefined);
    const [dialogActionName, setDialogActionName] = useState<string | null>(null);

    // Delete alert state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string | null>(null);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedClassroom(undefined);
            setDialogActionName(null);
        }, 300);
    };

    const handleDeleteClick = (id: number, name: string) => {
        setItemToDelete(id);
        setItemName(name);
        setIsAlertOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete !== null) {
            router.delete(route('admin.classroom.destroy', itemToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAlertOpen(false);
                    setItemToDelete(null);
                    setItemName(null);
                },
            });
        }
    };

    return (
        <AdminLayout title="School">
            <Head title="School" />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <School className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">School Management</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Manage your school here.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                        <DialogTrigger asChild onClick={() => {
                                            setDialogActionName('add');
                                            setIsDialogOpen(true);
                                        }}>
                                            <Button className="w-full md:w-auto">
                                                <Plus className="size-4" />
                                                Add Classroom
                                            </Button>
                                        </DialogTrigger>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center gap-4">
                            <div className="w-full flex flex-col gap-4 bg-white rounded-lg overflow-hidden relative">
                                <img
                                    src={school.image}
                                    alt={school.name}
                                    className="w-full h-[400px] object-cover absolute inset-0"
                                />
                                <div className="relative w-full h-full p-4 bg-gradient-to-tl from-emerald-950/70 via-emerald-700/50 to-transparent">
                                    <div className="w-full flex flex-row items-center justify-between gap-2">
                                        <h1 className="text-xl md:text-2xl font-bold text-white">{school.name}</h1>
                                        <CopyCode textToCopy={school.referral_code} buttonLabel="Referral Code" />
                                    </div>
                                    <div className="w-full max-w-lg flex flex-col gap-2 mt-4">
                                        <div className="flex flex-row items-center gap-2">
                                            <MapPin className="size-6 text-white" />
                                            <p className="text-white text-md line-clamp-3">{school.address}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <Phone className="size-6 text-white" />
                                            <p className="text-white text-sm">{school.phone}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <Mail className="size-6 text-white" />
                                            <p className="text-white text-sm">{school.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="w-full py-4">
                            {classrooms && classrooms.data.length > 0 && (
                                <div className="w-full flex flex-col gap-4">
                                    {classrooms.data.map((classroom, index) => (
                                        <div key={index} className="w-full flex flex-col items-center justify-between gap-2 bg-yellow-100/50 rounded-lg p-4 border border-emerald-500">
                                            <div className="w-full flex flex-row items-center justify-between gap-2">
                                                <h1 className="text-2xl font-bold text-emerald-800">{classroom.name}</h1>
                                                <div className="flex flex-row items-center gap-2">
                                                    <DialogTrigger asChild onClick={() => {
                                                        setSelectedClassroom(classroom);
                                                        setDialogActionName('edit');
                                                        setIsDialogOpen(true);
                                                    }}>
                                                        <Button variant="outline" className="h-8 px-2 text-sky-600 bg-sky-50 border-sky-500 hover:bg-sky-100">
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <Button
                                                        variant="outline"
                                                        className="h-8 px-2 text-red-600 bg-red-50 border-red-500 hover:bg-red-100"
                                                        onClick={() => handleDeleteClick(classroom.id, classroom.name)}
                                                    >
                                                        <Trash className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-row items-center gap-4">
                                                <Avatar className="size-10">
                                                    <AvatarImage src={classroom.teacher.image} />
                                                    <AvatarFallback>{classroom.teacher.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="w-full max-w-xs flex flex-col">
                                                    <h1 className="text-lg font-bold text-emerald-800">{classroom.teacher.name}</h1>
                                                    <div className="w-full flex flex-row items-center justify-between gap-2">
                                                        <div className="flex flex-row items-center gap-2">
                                                            <Mail className="size-4 text-emerald-600" />
                                                            <p className="text-emerald-700 text-sm">{classroom.teacher.email}</p>
                                                        </div>
                                                        <div className="flex flex-row items-center gap-2">
                                                            <Phone className="size-4 text-emerald-600" />
                                                            <p className="text-emerald-700 text-sm">{classroom.teacher.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-col items-center justify-between gap-2 pt-6">
                                                <Table className="w-full rounded-lg border border-emerald-500">
                                                    <TableHeader>
                                                        <TableRow className="bg-emerald-500 hover:bg-emerald-600">
                                                            <TableHead className="text-white">No</TableHead>
                                                            <TableHead className="text-white">Student Details</TableHead>
                                                            <TableHead className="text-white">Have Resume</TableHead>
                                                            <TableHead className="text-white">Roadmap Favourite</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {classroom.students.length > 0 ? classroom.students.map((student, index) => (
                                                            <TableRow key={index} className={index % 2 === 0 ? 'bg-white/50 hover:bg-emerald-100' : 'bg-emerald-50 hover:bg-emerald-100'}>
                                                                <TableCell className="text-emerald-800">{index + 1}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-row items-center gap-5">
                                                                        <Avatar className="size-10 rounded-md">
                                                                            <AvatarImage src={student.image} />
                                                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="flex flex-col">
                                                                            <h1 className="text-lg font-bold text-emerald-800">{student.name}</h1>
                                                                            <div className="flex flex-row items-center gap-2">
                                                                                <Mail className="size-4 text-emerald-600" />
                                                                                <p className="text-emerald-700 text-sm">{student.email}</p>
                                                                            </div>
                                                                            <div className="flex flex-row items-center gap-2">
                                                                                <Phone className="size-4 text-emerald-600" />
                                                                                <p className="text-emerald-700 text-sm">{student.phone}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {student.resume ? (
                                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                            <Check className="size-3 mr-1" /> Yes
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                                            <X className="size-3 mr-1" /> No
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {student.favourite === 0 ? (
                                                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                                            <X className="size-3 mr-1" /> None
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                            {student.favourite}
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        )) : (
                                                            <TableRow className="bg-white/50 hover:bg-emerald-100">
                                                                <TableCell colSpan={4} className="text-center">No students found</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogActionName === 'add' ? 'Add' : 'Edit'} Classroom
                        </DialogTitle>
                        <DialogDescription>
                            {dialogActionName === 'add' ? 'Add a new classroom to your school.' : 'Edit an existing classroom.'}
                        </DialogDescription>
                    </DialogHeader>
                    <CreateEditForm mode={dialogActionName as 'add' | 'edit'} classroom={selectedClassroom} onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>
            <DestructiveAlert
                isOpen={isAlertOpen}
                onOpenChange={setIsAlertOpen}
                onConfirm={handleDeleteConfirm}
                itemId={itemToDelete}
                name={itemName}
                withIcon={true}
            />
        </AdminLayout>
    );
}
