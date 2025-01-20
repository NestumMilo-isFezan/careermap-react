import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { PaginatedData, Domain } from '@/types';

// Icons
import { Plus, Search, PackageOpen, X, Pencil, Trash, ScrollText, ChevronUp, ChevronDown } from 'lucide-react';

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
import { CourseForm } from './CourseForm';
import { CourseEditForm } from './CourseEditForm';

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

interface Course {
    id: number
    name: string
    description: string
    level: string
    faculty: string
    institution: string
    domain_id: number
    domain_name: string
    domain_description: string
}

export default function Index(
    { courses, queryParams = null, domains, messages }: { courses: PaginatedData<Course>, queryParams: any, domains: Domain[], messages: SessionMessages }
) {
    // Notfication
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const displayDuration = 4000

    const addNotification = (notification: Omit<NotificationData, 'id'>) => {
        const id = Date.now()
        const newNotification = { ...notification, id }

        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications, newNotification]
            if (updatedNotifications.length > 20) {
            updatedNotifications.splice(0, updatedNotifications.length - 20)
            }
            return updatedNotifications
        })

        // Play sound effect (if needed)
        // const notificationSound = new Audio('path/to/sound.mp3')
        // notificationSound.play().catch(error => console.error('Error playing sound:', error))
    }

    const removeNotification = (id: number) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        )
    }

    useEffect(() => {
        if (messages.add_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.add_success
            });
        }
        if (messages.update_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.update_success
            });
        }
        if (messages.delete_success) {
            addNotification({
                variant: 'success',
                title: 'Success',
                message: messages.delete_success
            });
        }
        if (messages.error) {
            addNotification({
                variant: 'danger',
                title: 'Error',
                message: messages.error
            });
        }
    }, [messages]);

    // Roadmap Filter and Search
    queryParams = queryParams ?? {};
    const searchFieldChanged = (field: string, value: string) => {
        if(value) {
            if(value === '0' || value === '') {
                delete queryParams[field];
            }
            else{
                queryParams[field] = value;
            }
        }
        else{
            delete queryParams[field];
        }

        router.get(route('admin.course.index'), queryParams, { preserveState: true, preserveScroll: true });

    };
    const onKeyPress = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;
        searchFieldChanged(field, e.currentTarget.value);
    }
    const clearDomainFilter = () => {
        setDomainFilter('0');
        delete queryParams['domain_id'];
        delete queryParams['page'];
        router.get(route('admin.course.index'), queryParams, { preserveState: true, preserveScroll: true });
    }
    const [domainFilter, setDomainFilter] = useState('0');

    // Roadmap Deletion
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [dialogActionName, setDialogActionName] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [itemName, setItemName] = useState<string | null>(null);

    const handleDeleteClick = (id: number, name: string) => {
        setItemToDelete(id);
        setItemName(name);
        setIsAlertOpen(true);
    };
    const handleDeleteConfirm = () => {
        if (itemToDelete !== null) {
            router.delete(route('admin.course.destroy', itemToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAlertOpen(false);
                    setItemToDelete(null);
                    setItemName(null);
                },
                onError: (errors) => {
                    addNotification({
                        variant: 'danger',
                        title: 'Error',
                        message: 'Failed to delete the course. Please try again.'
                    });
                }
            });
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const [levelFilter, setLevelFilter] = useState('0');
    const [sortBy, setSortBy] = useState(queryParams?.sort_by || 'domain_id');
    const [sortDirection, setSortDirection] = useState(queryParams?.sort_direction || 'asc');

    const clearLevelFilter = () => {
        setLevelFilter('0');
        delete queryParams['level'];
        router.get(route('admin.course.index'), queryParams, {
            preserveState: true,
            preserveScroll: true
        });
    }

    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDirection(newDirection);

        queryParams['sort_by'] = field;
        queryParams['sort_direction'] = newDirection;
        delete queryParams['page'];

        router.get(route('admin.course.index'), queryParams, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Course">
            <Head title="Course" />
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
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <ScrollText className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Course Management</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Manage your courses here.
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
                                            Add Course
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 w-full px-1 py-2 pb-5">
                                <div className="relative w-full max-w-sm">
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                        onBlur={ (e) => { delete queryParams['page']; searchFieldChanged('name', e.target.value) } }
                                        onKeyDown={ (e) => onKeyPress('name', e)}
                                    />
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                </div>
                                <div className="flex flex-row gap-2 w-full max-w-sm">
                                    <Select
                                        value={domainFilter}
                                        onValueChange={ (e) => { setDomainFilter(e); delete queryParams['page']; searchFieldChanged('domain_id', e) } }
                                    >
                                        <SelectTrigger className="bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                            <SelectValue placeholder="Domain Filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="text-emerald-500 font-bold">{"Domain Name (Field of Study)"}</SelectLabel>
                                                    <SelectItem value="0">{"All Domains"}</SelectItem>
                                                    {domains && domains.map((domain : Domain) => (
                                                        <SelectItem key={domain.id} value={domain.id.toString()}>{domain.name}</SelectItem>)
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
                                <div className="flex flex-row gap-2 w-full max-w-sm">
                                    <Select
                                        value={levelFilter}
                                        onValueChange={(e) => {
                                            setLevelFilter(e);
                                            delete queryParams['page'];
                                            searchFieldChanged('level', e);
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                            <SelectValue placeholder="Level Filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="text-emerald-500 font-bold">Course Level</SelectLabel>
                                                <SelectItem value="0">All Levels</SelectItem>
                                                <SelectItem value="foundation">Foundation</SelectItem>
                                                <SelectItem value="diploma">Diploma</SelectItem>
                                                <SelectItem value="bachelor">Bachelor</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {levelFilter !== '0' && (
                                        <Button onClick={clearLevelFilter} variant="destructive">
                                            <X />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="w-full rounded-xl px-6 py-2">
                            <div className="border border-primary rounded-xl overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-emerald-500/80 hover:bg-emerald-500/40 transition-colors">
                                            <TableHead className="text-emerald-700 font-bold w-[5%] first:rounded-tl-lg">No</TableHead>
                                            <TableHead
                                                className="text-emerald-700 font-bold w-[35%] cursor-pointer"
                                                onClick={() => handleSort('course_name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Course Details
                                                    {sortBy === 'course_name' && (
                                                        sortDirection === 'asc' ?
                                                        <ChevronUp className="h-4 w-4" /> :
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[20%]">Institution</TableHead>
                                            <TableHead
                                                className="text-emerald-700 font-bold w-[15%] cursor-pointer"
                                                onClick={() => handleSort('domain_id')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Domain
                                                    {sortBy === 'domain_id' && (
                                                        sortDirection === 'asc' ?
                                                        <ChevronUp className="h-4 w-4" /> :
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="text-emerald-700 font-bold w-[15%] cursor-pointer"
                                                onClick={() => handleSort('course_level')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Course Level
                                                    {sortBy === 'course_level' && (
                                                        sortDirection === 'asc' ?
                                                        <ChevronUp className="h-4 w-4" /> :
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[10%] last:rounded-tr-lg">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses && courses.data.length > 0 ? (
                                            courses.data.map((course: Course, index: number) => (
                                                <TableRow
                                                    key={course.id}
                                                    className="hover:bg-emerald-50 transition-colors"
                                                >
                                                    <TableCell className="text-emerald-600">{index + 1}</TableCell>
                                                    <TableCell className="font-medium text-emerald-700">
                                                        <div className="w-full max-w-sm flex flex-col">
                                                            <span className="text-emerald-700 font-bold">{course.name}</span>
                                                            <span className="text-emerald-600">{course.faculty}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-emerald-600">
                                                        {course.institution}
                                                    </TableCell>
                                                    <TableCell className="capitalize text-emerald-600">{course.domain_name}</TableCell>
                                                    <TableCell className="capitalize text-emerald-600">{course.level}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <DialogTrigger asChild key={course.id + 'edit'} onClick={() => {
                                                                setDialogActionName('edit');
                                                                setSelectedCourse(course);
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
                                                                onClick={() => handleDeleteClick(course.id, course.name)}
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
                                                <TableCell colSpan={7} className="text-center text-emerald-600 rounded-b-lg">
                                                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                                                        <PackageOpen className="size-12 text-emerald-500" />
                                                        <p className="text-pretty font-bold text-lg text-emerald-900">No Curricular Found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {courses && courses.meta && courses.data.length > 0 && (
                                <div className="flex items-center justify-center mt-8">
                                    <Pagination meta={courses.meta} />
                                </div>
                            )}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    <DialogContent className="w-full max-w-screen h-screen bg-emerald-50">
                        <DialogHeader className="mb-0 pb-0">
                            <DialogTitle className="text-emerald-900">
                                {dialogActionName === 'add' ? 'Add' : 'Edit'} Course
                            </DialogTitle>
                            <DialogDescription className="text-slate-700">
                                {dialogActionName === 'add' ? 'Add a new course' : 'Edit existing course'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto">
                            <div
                                id="course-form-container"
                                className="w-full flex flex-col bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-lg px-4 md:px-8 py-4 border border-primary"
                            >
                                <div className="w-full bg-emerald-100/50 border border-primary rounded-lg px-4 md:px-6 py-4">
                                    {isDialogOpen && dialogActionName === 'add' && (
                                        <CourseForm domains={domains} />
                                    )}
                                    {isDialogOpen && dialogActionName === 'edit' && selectedCourse && (
                                        <CourseEditForm
                                            course={selectedCourse}
                                            domains={domains}
                                            onClose={() => {
                                                setIsDialogOpen(false);
                                                setSelectedCourse(undefined);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>

                    <DestructiveAlert
                        isOpen={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                        onConfirm={handleDeleteConfirm}
                        itemId={itemToDelete}
                        name={itemName}
                        withIcon={true}
                    />
                </Dialog>

                <div className="fixed inset-x-8 top-0 z-[99] flex max-w-full flex-col gap-2 bg-transparent px-6 py-6 md:bottom-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm">
                    {notifications.map(notification => (
                        <Notification
                            key={notification.id}
                            {...notification}
                            onDismiss={() => removeNotification(notification.id)}
                            displayDuration={displayDuration}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
