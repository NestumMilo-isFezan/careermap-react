import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { PaginatedData, Roadmap, Domain } from '@/types';

// Icons
import { Plus, Search, PackageOpen, X } from 'lucide-react';

// Components
import Pagination from '@/Components/Pagination';
import { Button, buttonVariants } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import RoadmapItem from '@/Components/Card/RoadmapItem';
import { DestructiveAlert } from '@/Components/shadcn/AlertDialog';
import { Notification, NotificationType } from '@/Components/Notification';

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
    { roadmaps, queryParams = null, domains, messages }: { roadmaps: PaginatedData<Roadmap>, queryParams: any, domains: Domain[], messages: SessionMessages }
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

        router.get(route('admin.roadmap.index'), queryParams, { preserveState: true, preserveScroll: true });

    };
    const onKeyPress = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;
        searchFieldChanged(field, e.currentTarget.value);
    }
    const clearDomainFilter = () => {
        setDomainFilter('0');
        delete queryParams['domain_id'];
        router.get(route('admin.roadmap.index'), queryParams, { preserveState: true, preserveScroll: true });
    }
    const [domainFilter, setDomainFilter] = useState('0');

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
            router.delete(route('admin.roadmap.destroy', { roadmap: itemToDelete }), {
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
        <AdminLayout title="Roadmap">
            <Head title="Roadmap" />
            <div className="flex flex-col w-full pb-10">
                {/* <div className="flex items-center justify-between px-6 py-2">
                    <button onClick={startPolling} className={`text-white font-bold py-2 px-4 rounded ${polling ? 'bg-red-500' : 'bg-emerald-500'}`}>{polling ? 'Stop Polling' : 'Start Polling'}</button>
                </div> */}
                <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                    <div className="flex flex-row items-center justify-between gap-3 px-6 py-2 pb-5">
                        <div className="flex flex-row items-center gap-3 lg:w-full lg:max-w-lg">
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
                            <div className="flex flex-row gap-2 w-full max-w-sm">
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
                        </div>
                        <div>
                            <Link href={route('admin.roadmap.create')} className={buttonVariants({ variant: "default" })} >
                                <Plus />
                                <span className="ml-2">New Roadmap</span>
                            </Link>
                        </div>
                    </div>
                        {roadmaps && roadmaps.data.length > 0 ? (
                            <>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-6 py-2">
                                {roadmaps.data.map((roadmap : Roadmap) => (
                                    <RoadmapItem roadmap={roadmap} onDelete={handleDeleteClick} key={roadmap.id} />
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

                <DestructiveAlert
                    isOpen={isAlertOpen}
                    onOpenChange={setIsAlertOpen}
                    onConfirm={handleDeleteConfirm}
                    itemId={itemToDelete}
                    name={itemName}
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
