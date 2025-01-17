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
  } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';

// Components
import UserNode from './Node/UserNode';
import { PersonaEdge, DomainEdge, UniversityEdge, CourseEdge, PrerequisiteEdge, PreUniversityEdge } from './Edge/Edge';
import { DomainCard, PersonaCard, FoundationCard, RoadmapNode, SubjectCard, DiplomaCard, UniversityCard } from './Node/RoadmapNode';
import RoadmapSubFlowNode from './Node/RoadmapSubFlowNode';
import { SelectedRoadmap } from '@/types';

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

export default function ViewModal({ roadmap_item }: { roadmap_item: SelectedRoadmap }) {
    const prerequisites = roadmap_item.prerequisites;
    const personas = roadmap_item.personas;
    const domain = roadmap_item.domain;
    const universityCourse = roadmap_item.university_course;
    const foundationCourse = roadmap_item.foundation_course;
    const diplomaCourse = roadmap_item.diploma_course;

    // Calculate height based on number of prerequisites
    const subjectFlowHeight = 300 + (prerequisites.length * 80);
    const personaFlowHeight = 200 + (personas.length * 120);
    const universityFlowHeight = 750 + (universityCourse.courses.length * 200);
    const preuniversityFlowHeight = 800;

    let initialNodes : Node[] = [
        { id: 'user-node', position: { x: 0, y: 0 }, data: { label: 'User', color: 'blue' }, type: 'user' },
        {
            id: 'subflow-1',
            position: { x: 200, y: 100 },
            type: 'roadmap_subflow',
            data: { label: 'Prerequisites', category: 'subject', width: 550, height: subjectFlowHeight },
        },
        {
            id: 'subflow-2',
            position: { x: 200, y: -personaFlowHeight + 50 },
            type: 'roadmap_subflow',
            data: { label: 'Personality', category: 'persona', width: 550, height: personaFlowHeight },
        },
        {
            id: 'subflow-3',
            position: { x: 900, y: -100 },
            type: 'roadmap_subflow',
            data: { label: 'Pre-University', category: 'preuniversity', width: 550, height: preuniversityFlowHeight },
        },
        {
            id: 'subflow-4',
            position: { x: 1900, y: -80 },
            type: 'roadmap_subflow',
            data: { label: 'University', category: 'university', width: 550, height: universityFlowHeight },
        },
        {
            id: 'title-subject',
            position: { x: 10, y: 10 },
            type: 'roadmap',
            data: { label: 'Prerequisites', category: 'subject' },
            parentId: 'subflow-1',
            extent: 'parent'
        },
        {
            id: 'title-personality',
            position: { x: 10, y: 10 },
            type: 'roadmap',
            data: { label: 'Personality', category: 'persona' },
            parentId: 'subflow-2',
            extent: 'parent'
        },
        {
            id: 'title-preuniversity',
            position: { x: 550/2.5, y: preuniversityFlowHeight/9 },
            type: 'roadmap',
            data: { label: 'Pre-University', category: 'preuniversity', },
            parentId: 'subflow-3',
            extent: 'parent'
        },
        {
            id: 'preuniversity-stpm',
            position: { x: 100, y: 20 },
            type: 'roadmap',
            data: { label: 'STPM', category: 'preuniversity',},
            parentId: 'subflow-3',
            extent: 'parent'
        },
        {
            id: 'preuniversity-matrik',
            position: { x: 400, y: 20 },
            type: 'roadmap',
            data: { label: 'Matriculation', category: 'preuniversity',},
            parentId: 'subflow-3',
            extent: 'parent'
        },
        {
            id: 'preuniversity-diploma',
            position: { x: 70, y: (preuniversityFlowHeight/2) },
            type: 'roadmap',
            data: { label: 'Diploma', category: 'preuniversity',},
            parentId: 'subflow-3',
            extent: 'parent'
        },
        {
            id: 'preuniversity-foundation',
            position: { x: 400, y: (preuniversityFlowHeight/2) - (preuniversityFlowHeight/5) },
            type: 'roadmap',
            data: { label: 'Foundation', category: 'preuniversity',},
            parentId: 'subflow-3',
            extent: 'parent'
        },
        {
            id: 'title-domain',
            position: { x: 1550, y: -60 },
            type: 'domain',
            data: { label: 'Domain', category: 'domain', domain: domain.name },
        },
        {
            id: 'title-university',
            position: { x: 30, y: 30 },
            type: 'roadmap',
            data: { label: 'University', category: 'university', },
            parentId: 'subflow-4',
            extent: 'parent'
        },
    ];

    let initialEdges : Edge[] = [
        {
            id: 'edge-user-subject',
            source: 'user-node',
            target: 'title-subject',
            type: 'prerequisite',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#10b981' },
            animated: true
        },
        {
            id: 'edge-user-persona',
            source: 'user-node',
            target: 'title-personality',
            type: 'persona',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#E11D48' },
            animated: true
        },
        {
            id: 'edge-prerequisite-preuniversity',
            source: 'subflow-1',
            target: 'title-preuniversity',
            type: 'prerequisite',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#10b981' },
            animated: true
        },
        {
            id: 'edge-preuniversity-stpm',
            source: 'title-preuniversity',
            target: 'preuniversity-stpm',
            type: 'preuniversity',
            sourceHandle: 'top-source',
            targetHandle: 'right-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        },
        {
            id: 'edge-preuniversity-matrik',
            source: 'title-preuniversity',
            target: 'preuniversity-matrik',
            type: 'preuniversity',
            sourceHandle: 'top-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        },
        {
            id: 'edge-preuniversity-diploma',
            source: 'title-preuniversity',
            target: 'preuniversity-diploma',
            type: 'preuniversity',
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        },
        {
            id: 'edge-preuniversity-foundation',
            source: 'title-preuniversity',
            target: 'preuniversity-foundation',
            type: 'preuniversity',
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        },
        {
            id: 'edge-persona-preuniversity',
            source: 'subflow-2',
            target: 'title-preuniversity',
            type: 'persona',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#E11D48' },
            animated: true
        },
        {
            id: 'edge-preuniversity-domain',
            source: 'title-preuniversity',
            target: 'title-domain',
            type: 'preuniversity',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        },
        {
            id: 'edge-domain-university',
            source: 'title-domain',
            target: 'title-university',
            type: 'domain',
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#0EA5E9' },
            animated: true
        },
    ];

    // Nodes
    prerequisites.forEach((prerequisite, index) => {
        initialNodes.push({
            id: `prerequisite-${prerequisite.id}`,
            position: {
                x: 120,
                y: 60 + (index * 200) // Increment Y position for each item
            },
            type: 'subject',
            data: { label: prerequisite.name, category: 'subject', subject: prerequisite },
            parentId: 'subflow-1',
            extent: 'parent'
        });
    });

    personas.forEach((persona, index) => {
        initialNodes.push({
            id: `persona-${persona.id}`,
            position: { x: 120, y: 60 + (index * 190) },
            type: 'persona',
            data: { label: persona.name, category: 'persona', persona: persona },
            parentId: 'subflow-2',
            extent: 'parent'
        });
    });


    initialNodes.push({
        id: `foundation-${foundationCourse.id}`,
        position: { x: 270, y: (preuniversityFlowHeight/2) },
        type: 'foundation',
        data: { label: foundationCourse.institution_name, category: 'preuniversity', foundation: foundationCourse },
        parentId: 'subflow-3',
        extent: 'parent'
    });

    initialNodes.push({
        id: `diploma-${diplomaCourse.id}`,
        position: { x: 20, y: (preuniversityFlowHeight/2) + (preuniversityFlowHeight/4.5) },
        type: 'diploma',
        data: { label: diplomaCourse.institution_name, category: 'preuniversity', diploma: diplomaCourse },
        parentId: 'subflow-3',
        extent: 'parent'
    });

    initialNodes.push({
        id: `title-university-${universityCourse.id}`,
        position: { x: 280, y: 90},
        type: 'roadmap',
        data: { label: universityCourse.institution_name, category: 'university',},
        parentId: 'subflow-4',
        extent: 'parent'
    });
    universityCourse.courses.forEach((course, index) => {
        initialNodes.push({
            id: `university-${course.id}`,
            position: { x: 150, y: 150 + (index * 200) },
            type: 'university',
            data: { label: course.course_name, category: 'university', university: course },
            parentId: 'subflow-4',
            extent: 'parent'
        });
    });
    // Edges
    prerequisites.forEach((prerequisite) => {
        initialEdges.push(
            {
                id: `subject-edge-${prerequisite.id}`,
                target: `prerequisite-${prerequisite.id}`,
                source: 'title-subject',
                type: 'prerequisite',
                sourceHandle: 'bottom-source',
                targetHandle: 'left-target',
                markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#10b981' },
                animated: true
            });
    });

    personas.forEach((persona) => {
        initialEdges.push(
            {
                id: `persona-edge-${persona.id}`,
                target: `persona-${persona.id}`,
                source: 'title-personality',
                type: 'persona',
                sourceHandle: 'bottom-source',
                targetHandle: 'left-target',
                markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#E11D48' },
                animated: true
            });
    });

    initialEdges.push(
        {
            id: `foundation-edge-${foundationCourse.id}`,
            target: `foundation-${foundationCourse.id}`,
            source: 'preuniversity-foundation',
            type: 'preuniversity',
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        });

    initialEdges.push(
        {
            id: `diploma-edge-${diplomaCourse.id}`,
            target: `diploma-${diplomaCourse.id}`,
            source: 'preuniversity-diploma',
            type: 'preuniversity',
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
            animated: true
        });

    initialEdges.push({
        id: `university-title-edge-${universityCourse.id}`,
        target: `title-university-${universityCourse.id}`,
        source: 'title-university',
        type: 'university',
        sourceHandle: 'bottom-source',
        targetHandle: 'left-target',
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#F59E0B' },
        animated: true
    });
    universityCourse.courses.forEach((course, index) => {
        initialEdges.push({
            id: `university-edge-${course.id}`,
            target: `university-${course.id}`,
            source: `title-university-${universityCourse.id}`,
            type: 'university',
            sourceHandle: 'right-source',
            targetHandle: 'right-target',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#F59E0B' },
            animated: true
        });
    });


    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="w-full h-full rounded-md bg-yellow-50 border border-emerald-500 p-4">
            <div style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                >
                    <Controls />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
