import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { PaginatedData } from '@/types';

// Icons
import { Search, PackageOpen, Trash, Users, ArrowUpDown } from 'lucide-react';

// Components
import Pagination from '@/Components/Pagination';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import { Notification, NotificationType } from '@/Components/Notification';
import { ScrollArea, ScrollBar } from '@/shadcn/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';

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

interface User {
    id: number
    name: string
    email: string
    role: string
    created_at: string
}

export default function Index(
    { users, queryParams = null, messages }: { users: PaginatedData<User>, queryParams: any, messages: SessionMessages }
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
            if( value === '' || value === '7') {
                delete queryParams[field];
            }
            else{
                queryParams[field] = value;
            }
        }
        else{
            delete queryParams[field];
        }

        router.get(route('admin.user.index'), queryParams, { preserveState: true, preserveScroll: true });
    };
    const onKeyPress = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;
        searchFieldChanged(field, e.currentTarget.value);
    }

    const clearRoleFilter = () => {
        setRoleFilter('7');
        delete queryParams['role'];
        router.get(route('admin.user.index'), queryParams, { preserveState: true, preserveScroll: true });
    }
    const [roleFilter, setRoleFilter] = useState('0');

    // Roadmap Deletion
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
            router.delete(route('admin.user.destroy', itemToDelete), {
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
                        message: 'Failed to delete the user. Please try again.'
                    });
                }
            });
        }
    };

    // Update sort handling to handle multiple columns
    const [sortConfig, setSortConfig] = useState({
        column: 'created_at',
        direction: 'desc' as 'asc' | 'desc'
    });

    const handleSort = (column: string) => {
        const newDirection =
            sortConfig.column === column && sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc';

        setSortConfig({ column, direction: newDirection });
        searchFieldChanged(`sort_${column}`, newDirection);
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users" />
            <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full min-h-[80vh] p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <Users className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">User Management</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Manage system users here.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 w-full px-1 py-2 pb-5">
                                <div className="relative w-full max-w-sm">
                                    <Input
                                        type="text"
                                        placeholder="Search by name..."
                                        className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                        onBlur={ (e) => searchFieldChanged('name', e.target.value)}
                                        onKeyDown={ (e) => onKeyPress('name', e)}
                                    />
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                </div>
                                <div className="flex flex-row gap-2 w-full max-w-sm">
                                    <Select
                                        value={roleFilter}
                                        onValueChange={ (e) => { setRoleFilter(e); searchFieldChanged('role', e) } }
                                    >
                                        <SelectTrigger className="bg-white border-emerald-500 focus:border-emerald-500 text-emerald-500">
                                            <SelectValue placeholder="Filter by Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="text-emerald-500 font-bold">User Role</SelectLabel>
                                                <SelectItem value="7">All Roles</SelectItem>
                                                <SelectItem value="0">Student</SelectItem>
                                                <SelectItem value="1">Admin</SelectItem>
                                                <SelectItem value="2">Teacher</SelectItem>
                                                <SelectItem value="3">Pending Student</SelectItem>
                                                <SelectItem value="4">Pending Teacher</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="w-full rounded-xl px-6 py-2">
                            <div className="border border-primary rounded-xl overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-emerald-500/80 hover:bg-emerald-500/40 transition-colors">
                                            <TableHead className="text-emerald-700 font-bold w-[5%] first:rounded-tl-lg">No</TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[30%]">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleSort('name')}
                                                    className="h-8 px-2 hover:bg-emerald-400/20 hover:text-emerald-900"
                                                >
                                                    User Details
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[15%]">Role</TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[10%]">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleSort('created_at')}
                                                    className="h-8 px-2 hover:bg-emerald-400/20 hover:text-emerald-900"
                                                >
                                                    Created At
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-emerald-700 font-bold w-[10%] last:rounded-tr-lg">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users && users.data.length > 0 ? (
                                            users.data.map((user: User, index: number) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="hover:bg-emerald-50 transition-colors"
                                                >
                                                    <TableCell className="text-emerald-600">{index + 1}</TableCell>
                                                    <TableCell className="font-medium text-emerald-700">
                                                        <div className="flex flex-col">
                                                            <span className="text-emerald-700 font-bold">{user.name}</span>
                                                            <span className="text-emerald-600">{user.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="capitalize text-emerald-600">{user.role}</TableCell>
                                                    <TableCell className="text-emerald-600">{user.created_at}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeleteClick(user.id, user.name)}
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
                                                <TableCell colSpan={6} className="text-center text-emerald-600 rounded-b-lg">
                                                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                                                        <PackageOpen className="size-12 text-emerald-500" />
                                                        <p className="text-pretty font-bold text-lg text-emerald-900">No Users Found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {users && users.meta && users.data.length > 0 && (
                                <div className="flex items-center justify-center mt-8">
                                    <Pagination meta={users.meta} />
                                </div>
                            )}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    <DestructiveAlert
                        isOpen={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                        onConfirm={handleDeleteConfirm}
                        itemId={itemToDelete}
                        name={itemName}
                        withIcon={true}
                    />

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
