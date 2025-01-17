import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/shadcn/components/ui/card"
import { cn } from '@/shadcn/lib/utils';
import { HoverPopover } from '@/Components/shadcn/HoverPopever';
import { Info } from 'lucide-react';
import RoadmapIcon from '@/Components/Card/RoadmapIcon';

interface Subject {
    id: number;
    name: string;
    subject_name: string;
    grade: string;
    user_grade: string;
    status: string;
}

interface Persona {
    id: number;
    name: string;
    persona_name: string;
    persona_description: string;
    status: string;
}

interface Domain {
    id: number;
    name: string;
    description: string;
}

interface Foundation {
    institution_name: string;
    faculty_name: string;
    courses: {
        id: number;
        course_name: string;
        description: string;
    }[];
}

interface Diploma {
    institution_name: string;
    faculty_name: string;
    courses: {
        id: number;
        course_name: string;
        description: string;
    }[];
}

interface University {
    id: number;
    faculty_name: string;
    course_name: string;
    description: string;
    course_level: string;
}

export type RoadmapNode = Node<{
    label: string;
    subject?: Subject;
    persona?: Persona;
    domain?: Domain;
    foundation?: Foundation;
    diploma?: Diploma;
    university?: University;
    category?: 'subject' | 'persona' | 'domain' | 'university' | 'course' | 'preuniversity' | 'preuniversity-item';
}>;

const categoryStyle = {
        'subject': 'bg-emerald-50 border-emerald-500 text-emerald-900',
        'persona': 'bg-rose-50 border-rose-500 text-rose-900',
        'domain': 'bg-sky-50 border-sky-500 text-sky-900',
        'university': 'bg-amber-50 border-amber-500 text-amber-900',
        'course': 'bg-lime-50 border-lime-500 text-lime-900',
        'preuniversity': 'bg-purple-50 border-purple-500 text-purple-900',
        'preuniversity-item': 'bg-purple-50 border-purple-500 text-purple-900',
};

export function RoadmapNode({ data }: NodeProps<RoadmapNode>) {

    return (
        <>
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            <div className={cn(
                "flex flex-col gap-2 p-2 rounded-md border",
                categoryStyle[data.category ?? 'subject']
            )}>
                {data.category === 'preuniversity-item' ?
                    <p className="text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-purple-900">
                            {data.label}
                        </span>
                    </p>
                :
                    <p className="text-sm font-medium">{data.label}</p>
                }
            </div>
        </>
    );
}

export function SubjectCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <>
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            {/* Card */}
            <Card className="w-full max-w-xs bg-emerald-50 border-emerald-500">
                <CardHeader className="flex flex-col border-b pt-3 px-5 pb-1 border-emerald-400">
                    <CardTitle className="text-emerald-900">{data.subject?.subject_name ?? data.label}</CardTitle>
                    <CardDescription className="text-emerald-600">{data.subject?.name ?? ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 py-2 text-emerald-900">
                        <p className="text-sm">
                            <span className="font-bold">Requirement Grade : </span>
                            {data.subject?.grade ?? ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">User Grade : </span>
                            {data.subject?.user_grade ?? ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Status : </span>
                            {data.subject?.status === 'Passed' ?
                                <span className="text-sm py-1 px-4 border rounded-full bg-emerald-400/30 border-emerald-400 text-emerald-900">✅ {data.subject?.status}</span>
                            :
                                <span className="text-sm py-1 px-4 border rounded-full bg-rose-400/30 border-rose-400 text-rose-900">❌ {data.subject?.status}</span>
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>

    );
}

export function PersonaCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <>
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            {/* Card */}
            <Card className="w-full max-w-xs bg-rose-50 border-rose-500">
                <CardHeader className="flex flex-col border-b pt-3 px-5 pb-1 border-rose-400">
                    <CardTitle className="text-rose-900">{data.persona?.persona_name ?? data.label}</CardTitle>
                    <CardDescription className="text-rose-600">{data.persona?.persona_description ?? ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 py-2 text-rose-900">
                        <p className="text-sm">
                            <span className="font-bold">Why? : </span>
                            {data.persona?.name ?? ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Meet Requirements? : </span>
                            {data.persona?.status === 'High' ?
                                <span className="text-sm py-1 px-4 border rounded-full bg-emerald-400/30 border-emerald-400 text-emerald-900">✅ {data.persona?.status}</span>
                            :
                                data.persona?.status === 'Low' ?
                                    <span className="text-sm py-1 px-4 border rounded-full bg-amber-400/30 border-amber-400 text-amber-900">🫤 {data.persona?.status}</span>
                                :
                                <span className="text-sm py-1 px-4 border rounded-full bg-rose-400/30 border-rose-400 text-rose-900">❌ {data.persona?.status}</span>
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>

    );
}

export function FoundationCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <>
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            {/* Card */}
            <Card className="w-full max-w-xs bg-purple-50 border-purple-500">
                <CardHeader className="flex flex-col border-b pt-3 px-5 pb-1 border-purple-400">
                    <CardTitle className="text-purple-900">{data.foundation?.institution_name ?? data.label}</CardTitle>
                    <CardDescription className="text-purple-600">{data.foundation?.faculty_name ?? ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 py-2 text-purple-900">
                        <p className="text-sm">
                            <span className="font-bold">Courses : </span>
                            {data.foundation?.courses && data.foundation?.courses.length > 0 ?
                                data.foundation?.courses.map((course) => (
                                    <HoverPopover
                                        trigger={<p className="text-sm hover:underline">{course.course_name}</p>}
                                        content={
                                            <Card className="w-full max-w-xs bg-purple-50 border-purple-500 shadow-xl shadow-purple-800/10">
                                                <CardHeader className="flex flex-col border-b px-5 py-3 border-purple-400">
                                                    <CardTitle className="text-purple-900 flex flex-row items-center gap-2"> <Info className="w-4 h-4 text-purple-900" /> {course.course_name}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="px-5 py-3">
                                                    <p className="text-sm">{course.description}</p>
                                                </CardContent>
                                            </Card>
                                        }
                                    />
                                )) : <p className="text-sm">No courses found</p>
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export function DiplomaCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <>
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            {/* Card */}
            <Card className="w-full max-w-xs bg-purple-50 border-purple-500">
                <CardHeader className="flex flex-col border-b pt-3 px-5 pb-1 border-purple-400">
                    <CardTitle className="text-purple-900">{data.diploma?.institution_name ?? data.label}</CardTitle>
                    <CardDescription className="text-purple-600">{data.diploma?.faculty_name ?? ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 py-2 text-purple-900">
                        <p className="text-sm">
                            <span className="font-bold">Courses : </span>
                            {data.diploma?.courses && data.diploma?.courses.length > 0 ?
                                data.diploma?.courses.map((course) => (
                                    <HoverPopover
                                        trigger={<p className="text-sm hover:underline">{course.course_name}</p>}
                                        content={
                                            <Card className="w-full max-w-xs bg-purple-50 border-purple-500 shadow-xl shadow-purple-800/10">
                                                <CardHeader className="flex flex-col border-b px-5 py-3 border-purple-400">
                                                    <CardTitle className="text-purple-900 flex flex-row items-center gap-2"> <Info className="w-4 h-4 text-purple-900" /> {course.course_name}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="px-5 py-3">
                                                    <p className="text-sm">{course.description}</p>
                                                </CardContent>
                                            </Card>
                                        }
                                    />
                                )) : <p className="text-sm">No courses found</p>
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export function DomainCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <div className="relative w-2/3 max-w-xs">
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            <div className="w-full flex flex-col gap-2 bg-sky-50 border border-sky-500 rounded-md">
                <div className="w-full flex flex-row gap-4 items-center px-4 py-2 border-sky-500 border-b ">
                    <RoadmapIcon domain={data.domain?.name ?? ''} className="size-8 text-sky-900" />
                    <div className="w-full flex flex-col">
                        <h1 className="text-xs text-sky-900">Field Domain : </h1>
                        <h1 className="text-sm font-bold text-sky-900">{data.domain?.name}</h1>
                    </div>
                </div>

                <div className="flex flex-col gap-2 px-4 pb-4">
                    <p className="text-sm text-sky-600">{data.domain?.description}</p>
                </div>
            </div>

        </div>
    );
}

export function UniversityCard({ data }: NodeProps<RoadmapNode>) {

    return (
        <div className="relative">
            <Handle type="source" position={Position.Left} style={{ visibility: 'hidden' }} id="left-source"/>
            <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} id="left-target"/>
            <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} id="right-source"/>
            <Handle type="target" position={Position.Right} style={{ visibility: 'hidden' }} id="right-target"/>
            <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-source"/>
            <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} id="bottom-target"/>
            <Handle type="source" position={Position.Top} style={{ visibility: 'hidden' }} id="top-source"/>
            <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} id="top-target"/>
            <div className="w-full max-w-xs flex flex-col gap-2 bg-amber-50 border border-amber-500 rounded-md">
                <div className="flex flex-col px-4 py-2 border-amber-500 border-b">
                    <h1 className="text-sm font-bold text-amber-900">{data.university?.course_name}</h1>
                </div>
                <div className="flex flex-col px-4">
                    <p className="text-sm text-amber-900 font-bold">Faculty :</p>
                    <p className="text-sm text-amber-600">{data.university?.faculty_name}</p>
                </div>
                <div className="flex flex-col px-4 pb-4">
                    <p className="text-sm text-amber-900 font-bold">Course Level :</p>
                    <p className="text-sm text-amber-600">{data.university?.course_level}</p>
                </div>
            </div>

        </div>
    );
}
