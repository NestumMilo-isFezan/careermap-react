import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar";
import { Link, usePage } from '@inertiajs/react'
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
    LayoutDashboard,
    ChevronsUpDown,
    LogOut,
    UserCog,
    Medal,
    MessageCircle,
    Bug,
    Star,
    UserRoundPen,
    School
} from "lucide-react";

interface TeacherSidebarProps {
    openRatingModal: () => void;
    openReportBugModal: () => void;
}

export function TeacherSidebar({ openRatingModal, openReportBugModal }: TeacherSidebarProps) {
    const dummyUser = usePage().props.auth.user;

    // TODO: Menu items
    const items = [
        {
            title: "Dashboard",
            route: 'teacher.dashboard',
            icon: LayoutDashboard,
        },
        {
            title: "Curricular Exchanges",
            route: "teacher.curricular.index",
            icon: Medal,
        },
        {
            title: "Student Feedback",
            route: 'teacher.feedback.index',
            icon: MessageCircle,
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
                            <span className="truncate text-xs">Teacher Dashboard</span>
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
                        item.route === '#' ?
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild>
                                <Link href='#'>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        :
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild isActive={route().current(item.route)}>
                                <Link href={route(item.route)}>
                                {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
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
                            <DropdownMenuSeparator className="border border-emerald-600" />

                            <DropdownMenuLabel>
                                Account
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" asChild>
                                    <Link href={route('profile.edit')}>
                                        <UserRoundPen />
                                        <span>Profile Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" asChild>
                                    <Link href={route('profile.teacher.edit')}>
                                        <School />
                                        <span>Class Settings</span>
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
