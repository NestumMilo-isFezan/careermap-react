import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shadcn/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar";
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarTrigger,
  } from "@/shadcn/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup
} from "@/shadcn/components/ui/dropdown-menu";

import {
    MapPin,
    LayoutDashboard,
    UsersRound,
    FolderClosed,
    FileUser,
    Newspaper,
    ChevronRight,
    ChevronsUpDown,
    LogOut,
    UserCog,
    UserRoundPen,
    Star,
    Bug
} from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
    openRatingModal: () => void;
    openReportBugModal: () => void;
}

export function AppSidebar({ openRatingModal, openReportBugModal }: AppSidebarProps) {
    const { url } = usePage()
    const dummyUser = usePage().props.auth.user;
    const [openDrawer, setOpenDrawer] = useState(() => {
        const saved = localStorage.getItem('openDrawer');
        return saved ? JSON.parse(saved) : false;
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpenDrawer(newOpen);
        localStorage.setItem('openDrawer', JSON.stringify(newOpen));
    };


    // TODO: Menu items
    const items = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            route: route('admin.dashboard'),
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            url: "/admin/user",
            route: route('admin.user.index'),
            icon: UsersRound,
        },
        {
            title: "Career Roadmaps",
            url: "/admin/roadmap",
            route: route('admin.roadmap.index'),
            icon: MapPin,
        },
        {
            title: "Resources",
            url: url.startsWith("/admin/course") ? "/admin/course" : "/admin/school",
            icon: FolderClosed,
            subItems: [
                {
                    title: "Courses",
                    url: "/admin/course",
                    route: route('admin.course.index'),
                },
                {
                    title: "Schools",
                    url: "/admin/school",
                    route: "#",
                },
            ],
        },
        {
            title: "News Article",
            url: "/admin/news",
            route: route('admin.news.index'),
            icon: Newspaper,
        },
    ];

    return (
      <Sidebar collapsible="icon">
        {/* TODO: Header */}
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div
                            className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                        >
                            <SidebarTrigger />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">CareerMap</span>
                            <span className="truncate text-xs">Counsellor Dashboard</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        {/* TODO: Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
                Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) => (
                        item.subItems ? (
                            <Collapsible className="group/collapsible" open={openDrawer}>
                                <SidebarMenuItem key={index}>
                                    <CollapsibleTrigger asChild onClick={() => handleOpenChange(!openDrawer)}>
                                        <SidebarMenuButton isActive={url.startsWith(item.url)}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                            <ChevronRight
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem, subIndex) => (
                                                <SidebarMenuSubItem key={subIndex}>
                                                    <SidebarMenuSubButton asChild isActive={url.startsWith(subItem.url)}>
                                                        <Link href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild isActive={url.startsWith(item.url)}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* TODO: Footer */}
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-emerald-600"
                            >
                                <Avatar className="size-6 rounded-lg">
                                    <AvatarImage src={dummyUser.image || ''} />
                                    <AvatarFallback>{dummyUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{dummyUser.name}</span>
                                    <span className="truncate text-xs">{dummyUser.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            side="right"
                            className="min-w-64 rounded-lg mb-2 ms-2 border border-emerald-600 bg-primary text-primary-foreground"
                        >
                            <DropdownMenuLabel>
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={dummyUser.image || ''} alt={dummyUser.name} />
                                        <AvatarFallback className="rounded-lg">{dummyUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{dummyUser.name}</span>
                                        <span className="truncate text-xs">{dummyUser.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="border border-emerald-600" />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Support
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    className="hover:bg-emerald-600 hover:text-emerald-600-foreground"
                                    onClick={openRatingModal}
                                >
                                    <Star />
                                    <span>Rate and Comment</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-emerald-600 hover:text-emerald-600-foreground"
                                    onClick={openReportBugModal}
                                >
                                    <Bug />
                                    <span>Report a Bug</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" asChild>
                                    <Link href={route('profile.edit')}>
                                        <UserRoundPen />
                                        <span>Profile Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" asChild>
                                    <Link href={route('profile.account.edit')}>
                                        <UserCog />
                                        <span>Account Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" asChild>
                                    <Link href={route('logout')} method="post" className="w-full">
                                        <LogOut />
                                        <span>Logout</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }
