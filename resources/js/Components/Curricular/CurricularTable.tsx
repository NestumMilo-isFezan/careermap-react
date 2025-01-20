import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/shadcn/components/ui/table";
import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { Badge } from "@/shadcn/components/ui/badge";
import { FileText, Check, X, Pencil } from "lucide-react";
import { Curriculum, SoftSkill } from "@/types";
import { Dialog, DialogTrigger } from "@/shadcn/components/ui/dialog";
import CreateEdit from "@/Pages/Teacher/Curricular/CreateEdit";
import { useState } from "react";
import { router } from "@inertiajs/react";

interface CurricularTableProps {
    curricular: Curriculum[];
    softskills: SoftSkill[];
}

export default function CurricularTable({ curricular, softskills }: CurricularTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);

    const handleAssessClick = (curriculum: Curriculum) => {
        setSelectedCurriculum(curriculum);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedCurriculum(null);
        }, 300);
    };

    const handleEditClick = (curriculum: Curriculum) => {
        setSelectedCurriculum(curriculum);
        router.put(route('teacher.curricular.retract'), {
            curriculum_id: curriculum.id,
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
            },
            preserveScroll: true,
        });
    };

    const handleRejectClick = (curriculum: Curriculum) => {
        setSelectedCurriculum(curriculum);
        router.put(route('teacher.curricular.reject'), {
            curriculum_id: curriculum.id,
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="w-full flex flex-col gap-2">
                {curricular.length > 0 ? (
                    <div className="w-full flex flex-col gap-2">
                        {curricular.map((curriculum, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg border border-emerald-500">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="bg-emerald-100 hover:bg-emerald-200">
                                            <TableHead className="text-emerald-800 w-16">No</TableHead>
                                            <TableHead className="text-emerald-800">Curriculum Details</TableHead>
                                            <TableHead className="text-emerald-800">Document</TableHead>
                                            <TableHead className="text-emerald-800">Status</TableHead>
                                            <TableHead className="text-emerald-800 w-32">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key={idx} className="hover:bg-emerald-50">
                                            <TableCell className="text-emerald-700">{idx + 1}</TableCell>
                                            <TableCell className="text-emerald-700">
                                                <div className="flex flex-col">
                                                    <h1 className="text-lg font-bold text-emerald-800">{curriculum.name}</h1>
                                                    <p className="text-emerald-700 text-sm">{curriculum.description}</p>
                                                    <div className="flex flex-row items-center gap-2 pt-4">
                                                        <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 text-xs">
                                                            {curriculum.level.charAt(0).toUpperCase() + curriculum.level.slice(1)}
                                                        </Badge>
                                                        <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 text-xs">
                                                            {curriculum.type.charAt(0).toUpperCase() + curriculum.type.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-row items-center gap-2">
                                                    <a href={curriculum.document_url} target="_blank" className={buttonVariants({ variant: "outline", size: "sm", className: "bg-sky-300 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-500" })}>
                                                        <FileText className="size-4" />
                                                        <span className="text-xs">View</span>
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {curriculum.status === 'pending' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-500 text-emerald-700 bg-emerald-50 text-xs"
                                                    >
                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                    </Badge>
                                                )}
                                                {curriculum.status === 'approved' && (
                                                    <Badge
                                                        className="bg-emerald-500 hover:bg-emerald-600"
                                                    >
                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                    </Badge>
                                                )}
                                                {curriculum.status === 'rejected' && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {curriculum.status === 'pending' && (
                                                        <>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="size-8 bg-emerald-300 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-500"
                                                                onClick={() => handleAssessClick(curriculum)}
                                                            >
                                                                <Check className="size-2" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-8 bg-red-300 hover:bg-red-600 text-red-700 hover:text-white border-red-500"
                                                            onClick={() => handleRejectClick(curriculum)}
                                                        >
                                                            <X className="size-2" />
                                                        </Button>
                                                        </>
                                                    )}
                                                    {curriculum.status === 'approved' && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-8 bg-sky-300 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-500"
                                                            onClick={() => handleEditClick(curriculum)}
                                                        >
                                                            <Pencil className="size-2" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-emerald-600 italic">No curricular activities yet</p>
                )}
            </div>
            {selectedCurriculum && (
                <CreateEdit
                    curriculum={selectedCurriculum}
                    softskills={softskills}
                    onClose={handleDialogClose}
                />
            )}
        </Dialog>
    );
}
