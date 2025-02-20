// Packages
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    type Node,
    Controls,
    BackgroundVariant,
    Background,
    MarkerType,
    Edge,
    MiniMap,
  } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';

// Components
import UserNode from './Node/UserNode';
import { PersonaEdge, DomainEdge, UniversityEdge, CourseEdge, PrerequisiteEdge, PreUniversityEdge } from './Edge/Edge';
import { DomainCard, PersonaCard, FoundationCard, RoadmapNode, SubjectCard, DiplomaCard, UniversityCard } from './Node/RoadmapNode';
import RoadmapSubFlowNode from './Node/RoadmapSubFlowNode';
import { SelectedRoadmap } from '@/types';
import { useFlowData } from '@/shadcn/hooks/use-flowdata';
import { Dialog } from '@/shadcn/components/ui/dialog';
import RoadmapIcon from '@/Components/Card/RoadmapIcon';
import { Progress } from '@/shadcn/components/ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shadcn/components/ui/hover-card';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { LayoutDashboard, Map, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import DownloadButton from './DownloadButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion"

interface RoadmapData {
    id: number;
    title: string;
    description: string;
    domain_id: number;
    domain_name: string;
    domain_description: string;
    image: string;
    recommendation_score: number;
}

interface Prerequisite {
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


interface UniversalCourse {
    id: number;
    faculty_name: string;
    course_name: string;
    description: string;
    course_level: string;
}

interface ModifiedCourse {
    id: number;
    course_name: string;
    description: string;
}

interface CourseData {
    universityCourses: {
      id: string;
      institution_name: string;
      courses: Array<UniversalCourse>;
    };
    foundationCourse: {
      id: string;
      institution_name: string;
      faculty_name: string;
      courses: Array<ModifiedCourse>;
    };
    diplomaCourse: {
      id: string;
      institution_name: string;
      faculty_name: string;
      courses: Array<ModifiedCourse>;
    };
}

const nodeTypes = {
    user: UserNode,
    roadmap: RoadmapNode,
    subject: SubjectCard,
    persona: PersonaCard,
    domain: DomainCard,
    roadmap_subflow: RoadmapSubFlowNode,
    university: UniversityCard,
    foundation: FoundationCard,
    diploma: DiplomaCard,
}

const edgeTypes = {
    'persona': PersonaEdge,
    'domain': DomainEdge,
    'university': UniversityEdge,
    'course': CourseEdge,
    'prerequisite': PrerequisiteEdge,
    'preuniversity': PreUniversityEdge,
}

export default function DisplayModal({ id }: { id: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { flowData, isLoading, error, roadmap, prerequisites, personas, courses } = useFlowData(id) as {
        flowData: any;
        isLoading: boolean;
        error: Error | null;
        roadmap: RoadmapData | null;
        prerequisites: Prerequisite[] | null;
        personas: Persona[] | null;
        courses: CourseData | null;
    };
    return (
        <div className="w-full h-full">
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {flowData &&
                    <div className="w-full h-full">
                    <div className="w-full h-full lg:flex lg:flex-row lg:gap-2">
                        <div className="lg:hidden w-full md:px-8 lg:px-0">
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="details" className="w-full">
                                        <div className="flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Details</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="flow" className="w-full">
                                        <div className="flex items-center gap-2">
                                            <Map className="h-4 w-4" />
                                            <span>Flow Diagram</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details">
                                    <div className="w-full flex flex-col gap-2 bg-emerald-400/70 rounded-md">
                                        <img src={roadmap?.image ?? ''} alt={roadmap?.title ?? ''} className="w-full h-34 md:h-[28vh] object-cover rounded-t-md" />
                                        <div className="flex flex-col gap-2 px-6 lg:px-4 pb-6 lg:pb-0">
                                            <h1 className="text-2xl font-bold text-emerald-950">{roadmap?.title ?? ''}</h1>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-emerald-950 font-black">What is this roadmap about?</p>
                                                <p className="text-sm text-emerald-900 text-justify">{roadmap?.description ?? ''}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-row gap-2 items-center">
                                                    <p className="text-sm text-emerald-950 font-black">Your compatibility score :</p>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <button type="button" className="focus:outline-none">
                                                                {(() => {
                                                                    const score = roadmap?.recommendation_score ?? 0;
                                                                    if (score <= 40) {
                                                                        return <span className="text-red-900 font-bold text-xs px-4 py-1 bg-red-400/50 rounded-full">❌ Not Recommended</span>;
                                                                    } else if (score <= 60) {
                                                                        return <span className="text-yellow-900 font-bold text-xs px-4 py-1 bg-yellow-400/50 rounded-full">🟨 Least Recommended</span>;
                                                                    } else {
                                                                        return <span className="text-green-900 font-bold text-xs px-4 py-1 bg-green-200/50 rounded-full border border-green-900">✅ Recommended</span>;
                                                                    }
                                                                })()}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent side="top" className="bg-emerald-100 border border-emerald-800 rounded-md p-0">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-row gap-2 items-center border-b border-emerald-800 px-4 py-2">
                                                                    <Info className="h-4 w-4 text-emerald-950" />
                                                                    <p className="text-sm text-emerald-950 font-black">Compatibility Score</p>
                                                                </div>
                                                                <div className="flex flex-col px-4 pb-2">
                                                                    <p className="text-sm text-emerald-950 font-black">Your compatibility score is based on the following criteria :</p>
                                                                    <p className="text-sm text-emerald-900 px-4 pt-2">
                                                                        <ul className="list-disc list-outside text-justify">
                                                                            <li>Your current trial SPM results.</li>
                                                                            <li>Your current SPM subject streams (Science / Non-Science).</li>
                                                                            <li>Your current personality (traits) results.</li>
                                                                        </ul>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <p className="text-sm text-emerald-900 font-black">{roadmap?.recommendation_score ? roadmap?.recommendation_score.toFixed(2) : '0.00'}%</p>
                                                    <Progress value={roadmap?.recommendation_score ?? 0} className="w-full bg-emerald-100/20 border border-emerald-800 rounded-md" />
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center pt-3">
                                                <p className="text-sm text-emerald-950 font-black">Fields of Study : </p>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <button type="button" className="focus:outline-none">
                                                            <div className="flex flex-row gap-2 items-center px-4 py-1 text-emerald-900 text-justify bg-green-200/50 rounded-full border border-emerald-800">
                                                                <RoadmapIcon className="h-4 w-4 text-emerald-900" domain={roadmap?.domain_name ?? ''}/>
                                                                <p className="text-xs font-black">{roadmap?.domain_name ?? ''}</p>
                                                            </div>
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="top" className="bg-emerald-100 border border-emerald-800 rounded-md p-0">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-row gap-2 items-center border-b border-emerald-800 px-4 py-2">
                                                                <RoadmapIcon className="h-4 w-4 text-emerald-900" domain={roadmap?.domain_name ?? ''}/>
                                                                <p className="text-sm text-emerald-950 font-black">{roadmap?.domain_name ?? ''}</p>
                                                            </div>
                                                            <div className="flex flex-col px-4 pb-2">
                                                                <p className="text-sm text-emerald-950 font-black">What is this field about?</p>
                                                                <p className="text-sm text-emerald-900 text-justify">{roadmap?.domain_description ?? ''}</p>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="flow" className="h-[70vh]">
                                    <div className="w-full h-full bg-yellow-50 flex flex-col items-center rounded-md border border-emerald-500 p-4">
                                        <div style={{ width: '100%', height: '100%' }}>
                                            <ReactFlow
                                                nodes={flowData.nodes}
                                                edges={flowData.edges}
                                                fitView
                                                nodeTypes={nodeTypes}
                                                edgeTypes={edgeTypes}
                                            >
                                                <Background />
                                                <Controls />
                                                <DownloadButton />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="hidden lg:flex lg:flex-row w-full h-full gap-2">
                            <Tabs defaultValue="details" className="w-full h-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="details" className="w-full">
                                        <div className="flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Details</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="flow" className="w-full">
                                        <div className="flex items-center gap-2">
                                            <Map className="h-4 w-4" />
                                            <span>Flow Diagram</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="h-[calc(100%-2.5rem)]">
                                    <div className="flex flex-col lg:flex-row w-full h-full gap-2 justify-between">
                                        {/* Left side - Roadmap Details */}
                                        <div className="w-full lg:w-1/2 h-full lg:max-w-md flex flex-col gap-2 bg-emerald-400/70 rounded-md">
                                            <img src={roadmap?.image ?? ''} alt={roadmap?.title ?? ''} className="w-full h-34 md:h-[28vh] object-cover rounded-t-md" />
                                            <div className="flex flex-col gap-2 px-4">
                                                <h1 className="text-2xl font-bold text-emerald-950">{roadmap?.title ?? ''}</h1>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-emerald-950 font-black">What is this roadmap about?</p>
                                                    <p className="text-sm text-emerald-900 text-justify">{roadmap?.description ?? ''}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <p className="text-sm text-emerald-950 font-black">Your compatibility score :</p>
                                                        <HoverCard>
                                                            <HoverCardTrigger asChild>
                                                                {(() => {
                                                                    const score = roadmap?.recommendation_score ?? 0;
                                                                    if (score <= 40) {
                                                                        return <span className="text-red-900 font-bold text-xs px-4 py-1 bg-red-400/50 rounded-full">❌ Not Recommended</span>;
                                                                    } else if (score <= 60) {
                                                                        return <span className="text-yellow-900 font-bold text-xs px-4 py-1 bg-yellow-400/50 rounded-full">🟨 Least Recommended</span>;
                                                                    } else {
                                                                        return <span className="text-green-900 font-bold text-xs px-4 py-1 bg-green-200/50 rounded-full border border-green-900">✅ Recommended</span>;
                                                                    }
                                                                })()}
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="bg-emerald-100 border border-emerald-800 rounded-md p-0">
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex flex-row gap-2 items-center border-b border-emerald-800 px-4 py-2">
                                                                        <Info className="h-4 w-4 text-emerald-950" />
                                                                        <p className="text-sm text-emerald-950 font-black">Compatibility Score</p>
                                                                    </div>
                                                                    <div className="flex flex-col px-4 pb-2">
                                                                        <p className="text-sm text-emerald-950 font-black">Your compatibility score is based on the following criteria :</p>
                                                                        <p className="text-sm text-emerald-900 px-4 pt-2">
                                                                            <ul className="list-disc list-outside text-justify">
                                                                                <li>Your current trial SPM results.</li>
                                                                                <li>Your current SPM subject streams (Science / Non-Science).</li>
                                                                                <li>Your current personality (traits) results.</li>
                                                                            </ul>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>

                                                    </div>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <p className="text-sm text-emerald-900 font-black">{roadmap?.recommendation_score ? roadmap?.recommendation_score.toFixed(2) : '0.00'}%</p>
                                                        <Progress value={roadmap?.recommendation_score ?? 0} className="w-full bg-emerald-100/20 border border-emerald-800 rounded-md" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-2 items-center pt-3">
                                                    <p className="text-sm text-emerald-950 font-black">Fields of Study : </p>
                                                    <HoverCard>
                                                        <HoverCardTrigger asChild>
                                                            <div className="flex flex-row gap-2 items-center px-4 py-1 text-emerald-900 text-justify bg-green-200/50 rounded-full border border-emerald-800">
                                                                <RoadmapIcon className="h-4 w-4 text-emerald-900" domain={roadmap?.domain_name ?? ''}/>
                                                                <p className="text-xs font-black">{roadmap?.domain_name ?? ''}</p>
                                                            </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent  className="bg-emerald-100 border border-emerald-800 rounded-md p-0">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-row gap-2 items-center border-b border-emerald-800 px-4 py-2">
                                                                    <RoadmapIcon className="h-4 w-4 text-emerald-900" domain={roadmap?.domain_name ?? ''}/>
                                                                    <p className="text-sm text-emerald-950 font-black">{roadmap?.domain_name ?? ''}</p>
                                                                </div>
                                                                <div className="flex flex-col px-4 pb-2">
                                                                    <p className="text-sm text-emerald-950 font-black">What is this field about?</p>
                                                                    <p className="text-sm text-emerald-900 text-justify">{roadmap?.domain_description ?? ''}</p>
                                                                </div>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Accordions */}
                                        <div className="w-full h-full overflow-y-auto px-4">
                                            <Accordion type="multiple" className="w-full">
                                                {/* Prerequisites Accordion */}
                                                <AccordionItem value="prerequisites" className="bg-emerald-300 border-emerald-500 border rounded-lg">
                                                    <AccordionTrigger className="px-4 text-lg font-semibold bg-emerald-300 hover:bg-emerald-500 rounded-lg hover:no-underline group">
                                                        <div className="flex items-center gap-2 text-emerald-900 group-hover:text-white">
                                                            🗒️What subjects you should score?
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-4 px-4 pt-4 border-t border-emerald-600">
                                                            {prerequisites?.map((subject) => (
                                                                <div key={subject.id} className="p-4 rounded-lg bg-emerald-50 border border-emerald-500">
                                                                    <h3 className="text-emerald-900 font-semibold">{subject.subject_name}</h3>
                                                                    <p className="text-emerald-600 text-sm">{subject.name}</p>
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-sm">
                                                                            <span className="font-semibold">Required Grade:</span> {subject.grade}
                                                                        </p>
                                                                        <p className="text-sm">
                                                                            {subject.user_grade ? (
                                                                                <span className="font-semibold">Your Grade:{subject.user_grade}</span>
                                                                            ):(
                                                                                <></>
                                                                            )}

                                                                        </p>
                                                                        <div>
                                                                            <span className={`text-sm px-3 py-1 rounded-full ${
                                                                                subject.status === 'Passed'
                                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                                    : 'bg-rose-100 text-rose-800'
                                                                            }`}>
                                                                                {subject.status === 'Passed' ? '✅' : '❌'} {subject.status}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* Persona Accordion */}
                                                <AccordionItem value="persona" className="bg-rose-300 border-rose-500 border rounded-lg mt-2">
                                                    <AccordionTrigger className="px-4 text-lg font-semibold bg-rose-300 hover:bg-rose-500 rounded-lg hover:no-underline group">
                                                        <div className="flex items-center gap-2 text-rose-900 group-hover:text-white">
                                                            🧑‍🤝‍🧑 Do you have personality for it?
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-4 px-4 pt-4 border-t border-rose-600">
                                                            {personas?.map((persona) => (
                                                                <div key={persona.id} className="p-4 rounded-lg bg-rose-50 border border-rose-500">
                                                                    <h3 className="text-rose-900 font-semibold">{persona.persona_name}</h3>
                                                                    <p className="text-rose-600 text-sm">{persona.persona_description}</p>
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-sm">
                                                                            <span className="font-semibold">Why?</span> {persona.name}
                                                                        </p>
                                                                        <div>
                                                                            <span className={`text-sm px-3 py-1 rounded-full ${
                                                                                persona.status === 'High'
                                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                                    : persona.status === 'Low'
                                                                                    ? 'bg-amber-100 text-amber-800'
                                                                                    : 'bg-rose-100 text-rose-800'
                                                                            }`}>
                                                                                {persona.status === 'High' ? '✅' : persona.status === 'Low' ? '🫤' : '❌'} {persona.status}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* Pre University Accordion */}
                                                <AccordionItem value="preuniversity" className="bg-purple-300 border-purple-500 border rounded-lg mt-2">
                                                    <AccordionTrigger className="px-4 text-lg font-semibold bg-purple-300 hover:bg-purple-500 rounded-lg hover:no-underline group">
                                                        <div className="flex items-center gap-2 text-purple-900 group-hover:text-white">
                                                            🎓 Pre University
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="px-4 pt-4 border-t border-purple-600">
                                                            <div className="space-y-4 mb-4">
                                                                {/* STPM Section */}
                                                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="text-purple-900 font-semibold">📝 STPM</h3>
                                                                        <span className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                                            Sijil Tinggi Persekolahan Malaysia
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-purple-600 text-sm mt-2">
                                                                        A pre-university qualification that is equivalent to A-Level, typically takes 1.5 years to complete.
                                                                    </p>
                                                                </div>

                                                                {/* Matriculation Section */}
                                                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="text-purple-900 font-semibold">📚 Matriculation</h3>
                                                                        <span className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                                            Program Matrikulasi
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-purple-600 text-sm mt-2">
                                                                        A one-year pre-university program offered by the Ministry of Education Malaysia.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <Accordion type="multiple" className="w-full">
                                                                {/* Foundation */}
                                                                <AccordionItem value="foundation" className="bg-purple-200 border-purple-500 border rounded-lg">
                                                                    <AccordionTrigger className="px-4 font-semibold bg-purple-200 hover:bg-purple-400 rounded-lg hover:no-underline group">
                                                                        <div className="flex flex-col w-full">
                                                                            <div className="flex items-center gap-2 text-purple-900 group-hover:text-white">
                                                                                📚 Foundation
                                                                                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                                                    Program Asasi
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-purple-700 text-left group-hover:text-white/90 mt-1">
                                                                                A one-year intensive pre-university program specifically designed to prepare students for a particular field of study at university level.
                                                                            </p>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <div className="p-4">
                                                                            {courses?.foundationCourse && courses.foundationCourse.courses && courses.foundationCourse.courses.length > 0 ? (
                                                                                <div className="rounded-lg bg-purple-50 border border-purple-500 p-4">
                                                                                    <h3 className="text-purple-900 font-semibold">{courses.foundationCourse.institution_name}</h3>
                                                                                    <p className="text-purple-600 text-sm">{courses.foundationCourse.faculty_name}</p>
                                                                                    <div className="mt-2 space-y-2">
                                                                                        {courses.foundationCourse.courses.map((course) => (
                                                                                            <div key={course.id} className="p-4 bg-purple-100 rounded border border-purple-500">
                                                                                                <p className="font-semibold">{course.course_name}</p>
                                                                                                <p className="text-sm">{course.description}</p>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="rounded-lg bg-purple-50 border border-purple-500 p-4">
                                                                                    <p className="text-purple-900">Not available yet</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>

                                                                {/* Diploma */}
                                                                <AccordionItem value="diploma" className="bg-purple-200 border-purple-500 border rounded-lg mt-2">
                                                                    <AccordionTrigger className="px-4 font-semibold bg-purple-200 hover:bg-purple-400 rounded-lg hover:no-underline group">
                                                                        <div className="flex flex-col w-full">
                                                                            <div className="flex items-center gap-2 text-purple-900 group-hover:text-white">
                                                                                📜 Diploma
                                                                                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                                                    Program Diploma
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-purple-700 text-left group-hover:text-white/90 mt-1">
                                                                                A 2.5 to 3-year tertiary education program that provides both theoretical knowledge and practical skills. Graduates can either continue to degree programs or enter the workforce.
                                                                            </p>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <div className="p-4">
                                                                            {courses?.diplomaCourse && courses.diplomaCourse.courses && courses.diplomaCourse.courses.length > 0 ? (
                                                                                <div className="rounded-lg bg-purple-50 border border-purple-500 p-4">
                                                                                    <h3 className="text-purple-900 font-semibold">{courses.diplomaCourse.institution_name}</h3>
                                                                                    <p className="text-purple-600 text-sm">{courses.diplomaCourse.faculty_name}</p>
                                                                                    <div className="mt-2 space-y-2">
                                                                                        {courses.diplomaCourse.courses.map((course) => (
                                                                                            <div key={course.id} className="p-4 bg-purple-100 border border-purple-500 rounded">
                                                                                                <p className="font-semibold">{course.course_name}</p>
                                                                                                <p className="text-sm">{course.description}</p>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="rounded-lg bg-purple-50 border border-purple-500 p-4">
                                                                                    <p className="text-purple-900">Not available yet</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* University Accordion */}
                                                <AccordionItem value="university" className="bg-amber-300 border-amber-500 border rounded-lg mt-2">
                                                    <AccordionTrigger className="px-4 text-lg font-semibold bg-amber-300 hover:bg-amber-500 rounded-lg hover:no-underline group">
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex items-center gap-2 text-amber-900 group-hover:text-white">
                                                                🏛️ University
                                                                <span className="text-xs px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                                                                    Program Ijazah Sarjana Muda
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-amber-700 text-left group-hover:text-white/90 mt-1">
                                                                A 3 to 4-year undergraduate degree program that provides comprehensive education in a specific field. This qualification is widely recognized and can lead to professional careers or further studies.
                                                            </p>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="p-4">
                                                            {courses?.universityCourses?.courses ? (
                                                                <div className="rounded-lg bg-amber-50 border border-amber-500 p-4">
                                                                    <h3 className="text-amber-900 font-semibold">{courses.universityCourses.institution_name}</h3>
                                                                    <div className="mt-2 space-y-2">
                                                                        {courses.universityCourses.courses.map((course) => (
                                                                            <div key={course.id} className="p-4 bg-amber-100 border border-amber-500 rounded">
                                                                                <p className="font-semibold">{course.course_name}</p>
                                                                                <p className="text-amber-600 text-sm">{course.faculty_name}</p>
                                                                                <div className="mt-2">
                                                                                    <p className="text-sm">
                                                                                        <span className="font-semibold">Course Level:</span> {course.course_level}
                                                                                    </p>
                                                                                    <p className="text-sm mt-1">{course.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="rounded-lg bg-amber-50 border border-amber-500 p-4">
                                                                    <p className="text-amber-900">Not available yet</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="flow" className="h-[calc(100%-2.5rem)]">
                                    <div className="w-full h-full bg-yellow-50 flex flex-col items-center rounded-md border border-emerald-500 p-4">
                                        <div style={{ width: '100%', height: '100%' }}>
                                            <ReactFlow
                                                nodes={flowData.nodes}
                                                edges={flowData.edges}
                                                fitView
                                                nodeTypes={nodeTypes}
                                                edgeTypes={edgeTypes}
                                            >
                                                <Background />
                                                <Controls />
                                                <DownloadButton />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                }
        </div>
      );
}
