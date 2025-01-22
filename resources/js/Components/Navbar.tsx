import { Link, usePage, usePoll } from '@inertiajs/react';
import { buttonVariants } from '@/shadcn/components/ui/button';
import { LogOut, UserCog, Menu, X, MessageSquare, UserRoundPen, GraduationCap, Star, Bug } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shadcn/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/shadcn/components/ui/avatar';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';
import { TooltipProvider } from '@/shadcn/components/ui/tooltip';
import { RatingModal } from './shadcn/RatingModal';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface NavbarProps {
    openRatingModal?: () => void;
    openReportBugModal?: () => void;
}

export default function Navbar({ openRatingModal, openReportBugModal }: NavbarProps) {
    const { url } = usePage();
    const user = usePage().props.auth.user ? usePage().props.auth.user : null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Add scroll spy hook
    const activeSection = useScrollSpy(['hero', 'about'], 100);

    const isActivePath = (path: string) => {
        if (path.startsWith('#')) {
            return activeSection === path.substring(1);
        }
        return url === path;
    };

    const scrollToSection = (e: React.MouseEvent<Element>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <header className="sticky top-0 flex justify-between items-center px-6 h-16 border-b border-emerald-700 bg-primary z-50">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <img src="/assets/careermap.png" alt="CareerMap" className="size-10" />
                            <h1 className="text-xl font-bold text-emerald-100">CareerMap</h1>
                        </div>
                    </Link>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-primary-foreground"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                <div className="hidden md:flex items-center gap-2">
                    {!user ? (
                        <nav className="flex items-center gap-x-1 me-6">
                            <Link
                                href="#hero"
                                onClick={(e) => scrollToSection(e, 'hero')}
                                className={buttonVariants({
                                    variant: isActivePath('#hero') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Home
                            </Link>
                            <Link
                                href="#about"
                                className={buttonVariants({
                                    variant: isActivePath('#about') ? "navlinkActive" : "navlink"
                                })}
                            >
                                About
                            </Link>
                        </nav>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <Link
                                href={route('student.home')}
                                className={buttonVariants({
                                    variant: isActivePath('/student/home') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Home
                            </Link>
                            <Link
                                href={route('student.roadmap.index')}
                                className={buttonVariants({
                                    variant: isActivePath('/student/roadmap/*') || isActivePath('/student/roadmap') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Roadmap
                            </Link>
                            <Link
                                href={route('student.traits.index')}
                                className={buttonVariants({
                                    variant: isActivePath('/student/traits/*') || isActivePath('/student/traits') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Traits
                            </Link>
                            <Link
                                href={route('student.resume.index')}
                                className={buttonVariants({
                                    variant: isActivePath('/student/resume/*') || isActivePath('/student/resume') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Resume
                            </Link>
                            <Link
                                href={route('student.curricular.index')}
                                className={buttonVariants({
                                    variant: isActivePath('/student/curricular/*') || isActivePath('/student/curricular') ? "navlinkActive" : "navlink"
                                })}
                            >
                                Curricular
                            </Link>
                        </div>
                    )
                }

                    {user ? (
                        <div className="flex items-center gap-x-2 px-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('student.feedback.index')} className="text-primary-foreground hover:bg-emerald-800/50 transition-all duration-200 rounded-full p-2">
                                            <MessageSquare className="size-5" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-emerald-800 text-emerald-100">
                                        <p>Feedback</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-x-2">
                                        <Avatar className="size-10 rounded-full border-2 border-emerald-900">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    side="bottom"
                                    className="min-w-64 rounded-lg mb-2 border border-emerald-600 bg-primary text-primary-foreground"
                                >
                                    <DropdownMenuLabel>
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="size-12 rounded-full border-4 border-emerald-900">
                                                <AvatarImage src={user.image} alt={user.name} />
                                                <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">{user.name}</span>
                                                <span className="truncate text-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="border border-emerald-600" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            Support
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem className="hover:bg-emerald-600 hover:text-emerald-600-foreground" onClick={openRatingModal}>
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
                                            <Link href={route('profile.student.edit')}>
                                                <GraduationCap />
                                                <span>Academic Details</span>
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
                        </div>
                    ) :
                    (
                        <div className="flex items-center gap-x-2">
                            <Link
                                href="/login"
                                className={buttonVariants({ variant: "login" })}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className={buttonVariants({ variant: "register" })}
                            >
                                Register
                            </Link>
                        </div>
                    )
                }
                </div>

                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-primary border-b border-primary-foreground/20 md:hidden">
                        <div className="flex flex-col p-4 space-y-4">
                            {!user ? (
                                <>
                                    <Link
                                        href="#hero"
                                        className={buttonVariants({
                                            variant: isActivePath('#hero') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="#about"
                                        className={buttonVariants({
                                            variant: isActivePath('#about') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        About
                                    </Link>
                                    <div className="flex flex-col gap-2 pt-4 border-t border-primary-foreground/20">
                                        <Link
                                            href="/login"
                                            className={buttonVariants({ variant: "login", className: "w-full" })}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className={buttonVariants({ variant: "register", className: "w-full" })}
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className={buttonVariants({
                                            variant: isActivePath('/student/home') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/student/roadmap"
                                        className={buttonVariants({
                                            variant: isActivePath('/student/roadmap') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Roadmap
                                    </Link>
                                    <Link
                                        href="/student/traits"
                                        className={buttonVariants({
                                            variant: isActivePath('/student/traits') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Traits
                                    </Link>
                                    <Link
                                        href="/student/resume"
                                        className={buttonVariants({
                                            variant: isActivePath('/student/resume') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Resume
                                    </Link>
                                    <Link
                                        href="/student/curricular"
                                        className={buttonVariants({
                                            variant: isActivePath('/student/curricular') ? "navlinkActive" : "navlink",
                                            className: "w-full justify-start"
                                        })}
                                    >
                                        Curricular
                                    </Link>
                                    <div className="flex items-center gap-x-2 pt-4 border-t border-primary-foreground/20">
                                        <Avatar className="size-10 rounded-full border-2 border-emerald-900">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{user.name}</span>
                                            <span className="text-xs text-primary-foreground/70">{user.email}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        className={buttonVariants({
                                            variant: "destructive",
                                            className: "w-full justify-start gap-2"
                                        })}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
