import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head } from "@inertiajs/react";
import { LayoutDashboard, Mail, MapPin, PackageOpen, Phone } from "lucide-react";
import { Button } from "@/shadcn/components/ui/button";
import { Pencil, Trash, Check, X } from "lucide-react";
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/shadcn/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/components/ui/avatar";
import { PaginatedData } from "@/types";

interface School {
    name: string;
    image: string;
    address: string;
    phone: string;
    email: string;
}

interface User {
    name: string;
    email: string;
    phone: string;
    image: string;
}

interface Classroom {
    name: string;
    students: PaginatedData<{
        name: string;
        email: string;
        phone: string;
        image: string;
        favourite: number;
        resume: boolean;
    }>
}

export default function Dashboard({ school, user, classroom }: { school: School, user: User, classroom: Classroom }) {
    return (
        <TeacherLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="flex flex-col w-full pb-10">
                    <div className="flex flex-col w-full p-6 pb-10 bg-emerald-50 border border-primary rounded-lg">
                        <div className="w-full flex flex-col items-center justify-between gap-3 px-6 py-2 pb-5">
                            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 gap-4">
                                <div className="flex flex-row items-center gap-x-4">
                                    <span className="inline-block p-2 md:p-3 bg-emerald-100 rounded-md border border-emerald-200">
                                        <LayoutDashboard className="size-5 md:size-6 text-emerald-600" />
                                    </span>
                                    <div className="flex flex-col">
                                        <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Your Dashboard</h1>
                                        <p className="text-emerald-700 text-xs md:text-sm text-justify max-w-lg">
                                            Welcome to your dashboard, .
                                        </p>
                                    </div>
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
                                        <h1 className="text-xl md:text-2xl font-bold text-white">{classroom.name}</h1>
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
                        <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
                            <div className="w-full flex flex-col items-center justify-between gap-2 bg-yellow-100/50 rounded-lg p-4 border border-emerald-500">
                                <div className="w-full flex flex-row items-center justify-between gap-2">
                                    <h1 className="text-2xl font-bold text-emerald-800">{classroom.name}</h1>
                                    <div className="flex flex-row items-center gap-2">

                                    </div>
                                </div>
                                <div className="w-full flex flex-row items-center gap-4">
                                    <Avatar className="size-10">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full max-w-xs flex flex-col">
                                        <h1 className="text-lg font-bold text-emerald-800">{user.name}</h1>
                                        <div className="w-full flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <Mail className="size-4 text-emerald-600" />
                                                <p className="text-emerald-700 text-sm">{user.email}</p>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <Phone className="size-4 text-emerald-600" />
                                                <p className="text-emerald-700 text-sm">{user.phone}</p>
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
                                                <TableHead className="text-white">Resume Prepared</TableHead>
                                                <TableHead className="text-white">Roadmap Favourite</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {classroom.students.data.length > 0 ? classroom.students.data.map((student, index) => (
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
                                                    <TableCell colSpan={4} className="text-center py-4">
                                                        <div className="flex flex-row items-center justify-center gap-2">
                                                            <PackageOpen className="size-6 text-emerald-600" />
                                                            <h1 className="text-md font-bold text-emerald-800">No students found</h1>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </TeacherLayout>
    );
}
