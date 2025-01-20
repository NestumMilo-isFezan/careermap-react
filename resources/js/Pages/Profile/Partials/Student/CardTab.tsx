import { User, GraduationCap } from "lucide-react"
import { cn } from "@/shadcn/lib/utils"
import { Button } from "@/shadcn/components/ui/button"
import { Card } from "@/shadcn/components/ui/card"
import { usePage } from "@inertiajs/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/components/ui/avatar"

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "grade", label: "Grade", icon: GraduationCap },
]

export function CardTab({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
    const user = usePage().props.auth.user;

    return (
        <Card className="h-[100vh-10rem] w-64 p-2 space-y-6 bg-emerald-100 border border-emerald-400">
            {/* User Profile Section */}
            <div className="flex flex-col items-center space-y-4 py-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="text-lg">{user.first_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="font-semibold text-lg text-emerald-900">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-sm text-muted-foreground">Student</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-1">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start gap-2 border border-emerald-400",
                            activeTab === tab.id &&
                            "font-medium bg-emerald-400 text-white border-emerald-500 hover:bg-emerald-500"
                        )}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </Button>
                ))}
            </div>
        </Card>
    )
}
