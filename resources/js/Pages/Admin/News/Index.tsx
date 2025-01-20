import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { News, PaginatedData } from '@/types';

// Icons
import { Search, Trash, ArrowUpDown, Plus, Pencil, Newspaper } from 'lucide-react';

// Components
import Pagination from '@/Components/Pagination';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import { Notification, NotificationType } from '@/Components/Notification';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription, DialogTrigger } from '@/shadcn/components/ui/dialog';
import CreateEditForm from './CreateEditForm';
import NewsCard from '@/Components/Card/NewsCard';

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

export default function Index(
    { news, queryParams = null, messages }: { news: PaginatedData<News>, queryParams: any, messages: SessionMessages }
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

        router.get(route('admin.news.index'), queryParams, { preserveState: true, preserveScroll: true });
    };
    const onKeyPress = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;
        searchFieldChanged(field, e.currentTarget.value);
    }

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

    // Roadmap Deletion
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemName, setItemName] = useState<string | null>(null);

    const handleDeleteClick = (id: number, name: string) => {
        setItemToDelete(id);
        setItemName(name);
        setIsAlertOpen(true);
    };

    const handleEditClick = (news: News) => {
        setSelectedNews(news);
        setDialogActionName('edit');
        setIsDialogOpen(true);
    };


    const handleDeleteConfirm = () => {
        if (itemToDelete !== null) {
            router.delete(route('admin.news.destroy', itemToDelete), {
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
                        message: 'Failed to delete the news. Please try again.'
                    });
                }
            });
        }
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | undefined>(undefined);
    const [dialogActionName, setDialogActionName] = useState<string | null>(null);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedNews(undefined);
            setDialogActionName(null);
        }, 300);
    };

    return (
        <AdminLayout title="News">
            <Head title="News" />
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
                <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full min-h-[80vh] p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <Newspaper className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">News Management</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Manage system news here.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-x-4">
                                    <DialogTrigger asChild onClick={() => {
                                        setDialogActionName('add');
                                        setIsDialogOpen(true);
                                    }}>
                                        <Button className="w-full md:w-auto">
                                            <Plus className="size-4" />
                                            Add News
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 w-full px-1 py-2 pb-5">
                                <div className="relative w-full max-w-sm">
                                    <Input
                                        type="text"
                                        placeholder="Search by name..."
                                        className="pl-10 border-emerald-500 placeholder:text-emerald-500 bg-white focus:border-emerald-500"
                                        onBlur={ (e) => searchFieldChanged('title', e.target.value)}
                                        onKeyDown={ (e) => onKeyPress('title', e)}
                                    />
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                </div>
                                <div className="">
                                    <Button
                                        variant="outline"
                                        className="h-8 px-2 text-emerald-600 bg-emerald-50 border-emerald-500 hover:bg-emerald-100"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center gap-3 px-1 py-2 pb-5">
                            {news.data && news.data.length > 0 ? (
                                <div className="w-full flex flex-col gap-3 px-1 py-2 pb-5">
                                    {news.data.map((news) => (
                                        <NewsCard key={news.id} news={news}>
                                            <DialogTrigger asChild onClick={() => {
                                                handleEditClick(news);
                                            }}>
                                                <Button variant="outline" className="h-8 px-2 text-sky-600 bg-sky-50 border-sky-500 hover:bg-sky-100">
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <Button onClick={() => handleDeleteClick(news.id, news.title)} variant="outline" className="h-8 px-2 text-red-600 bg-red-50 border-red-500 hover:bg-red-100">
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </NewsCard>
                                ))}
                                </div>
                            ) : (
                                <p>No news found</p>
                            )}
                        </div>
                        <div className="w-full flex flex-col items-center justify-center gap-3 px-1 py-2 pb-5">
                            {news.data && news.data.length > 0 && (
                                <Pagination
                                    meta={news.meta}
                                />
                            )}
                        </div>
                    </div>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {dialogActionName === 'add' ? 'Add' : 'Edit'} News
                            </DialogTitle>
                            <DialogDescription>
                                {dialogActionName === 'add' ? 'Add your news' : 'Edit your news'}
                            </DialogDescription>
                        </DialogHeader>
                        <div
                            id="news-form-container"
                            className="w-full flex flex-col bg-yellow-50/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] min-h-[80vh] rounded-lg px-8 py-4 border border-primary"
                        >
                            <div className="w-full bg-emerald-100/50 border border-primary rounded-lg px-6 py-4">
                            {isDialogOpen && (
                                <CreateEditForm
                                    mode={dialogActionName === 'add' ? 'create' : 'edit'}
                                    news={selectedNews}
                                    onClose={handleDialogClose}
                                    />
                            )}
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
            </Dialog>
        </AdminLayout>
    );
}
