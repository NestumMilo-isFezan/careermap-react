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
import { LayoutDashboard, Map } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';

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
    const { flowData, isLoading, error, roadmap } = useFlowData(id) as {
        flowData: any;
        isLoading: boolean;
        error: Error | null;
        roadmap: RoadmapData | null;
    };
    console.log(roadmap);
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
                                                    <p className="text-sm text-emerald-900 font-black">{roadmap?.recommendation_score ?? 0}%</p>
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
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="hidden lg:flex lg:flex-row w-full h-full gap-2">
                            <div className="w-full h-full lg:max-w-md flex flex-col gap-2 bg-emerald-400/70 rounded-md">
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
                                            <p className="text-sm text-emerald-900 font-black">{roadmap?.recommendation_score ?? 0}%</p>
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
                                    </ReactFlow>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
        </div>
      );
}
