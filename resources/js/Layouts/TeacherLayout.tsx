import { PropsWithChildren } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/shadcn/components/ui/sidebar"
import { AppSidebar } from "@/Components/shadcn/AppSidebar"
import { Separator } from "@/shadcn/components/ui/separator"
import React from 'react'

export default function Teacher({ children, title }: PropsWithChildren & { title: string }) {
    const [open, setOpen] = React.useState(false)
    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <AppSidebar />
            <main className="flex flex-col flex-1">
                <header className="flex items-center gap-2 px-4 py-5">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-xl font-semibold">{title}</h1>
                </header>
                <div className="flex flex-col flex-1 px-8 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
