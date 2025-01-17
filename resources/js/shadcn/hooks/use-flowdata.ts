import { useState, useEffect } from "react";
import { type Node, type Edge, MarkerType } from "@xyflow/react";
import axios from "axios";

interface FlowData {
  nodes: Node[];
  edges: Edge[];
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

interface Domain {
  id: number;
  name: string;
  description: string;
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


interface RoadmapData {
  roadmap: {
    id: number;
    title: string;
    description: string;
    domain_id: number;
    domain_name: string;
    domain_description: string;
    image: string;
    recommendation_score: number;
  };
}

interface CourseData {
  university_courses: {
    id: string;
    institution_name: string;
    courses: Array<UniversalCourse>;
  };
  foundation_course: {
    id: string;
    institution_name: string;
    faculty_name: string;
    courses: Array<ModifiedCourse>;
  };
  diploma_course: {
    id: string;
    institution_name: string;
    faculty_name: string;
    courses: Array<ModifiedCourse>;
  };
}

function calculateFlowHeights(data: {
    prerequisites: Prerequisite[],
    personas: Persona[],
    universityCourses: UniversalCourse[]
}) {
    const { prerequisites, personas, universityCourses } = data;

    // Base heights and spacing
    const baseHeight = 400;
    const itemSpacing = 120;
    const minSpacing = 50;

    // Calculate dynamic heights with minimum values
    const subjectFlowHeight = Math.max(baseHeight, baseHeight + (prerequisites.length * itemSpacing));
    const personaFlowHeight = Math.max(baseHeight, baseHeight + (personas.length * itemSpacing));
    const preuniversityFlowHeight = 800; // Keep fixed since it has fixed content
    const universityFlowHeight = Math.max(750, 750 + (universityCourses.length * 100));

    return {
        subjectFlowHeight,
        personaFlowHeight,
        preuniversityFlowHeight,
        universityFlowHeight
    };
}

export function useFlowData(id: string) {
    const [flowData, setFlowData] = useState<FlowData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(route('student.roadmap.show', {id: id}));

                const { data, courses } = response.data;
                const { roadmap, prerequisites, personas, domain } = data;
                const { universityCourses, foundationCourse, diplomaCourse } = courses;

                // Calculate heights based on content
                const heights = calculateFlowHeights({
                    prerequisites,
                    personas,
                    universityCourses: universityCourses.courses
                });

                // Transform the data into nodes and edges
                const nodes: Node[] = [
                    { id: 'user-node', position: { x: 0, y: 0 }, data: { label: 'User', color: 'blue' }, type: 'user' },
                    {
                        id: 'subflow-1',
                        position: { x: 200, y: 100 },
                        type: 'roadmap_subflow',
                        data: {
                            label: 'Prerequisites',
                            category: 'subject',
                            width: 550,
                            height: heights.subjectFlowHeight
                        },
                    },
                    {
                        id: 'subflow-2',
                        position: { x: 200, y: -heights.personaFlowHeight + 50 },
                        type: 'roadmap_subflow',
                        data: {
                            label: 'Personality',
                            category: 'persona',
                            width: 550,
                            height: heights.personaFlowHeight
                        },
                    },
                    {
                        id: 'subflow-3',
                        position: { x: 900, y: -100 },
                        type: 'roadmap_subflow',
                        data: {
                            label: 'Pre-University',
                            category: 'preuniversity',
                            width: 550,
                            height: heights.preuniversityFlowHeight
                        },
                    },
                    {
                        id: 'subflow-4',
                        position: { x: 1900, y: -80 },
                        type: 'roadmap_subflow',
                        data: {
                            label: 'University',
                            category: 'university',
                            width: 550,
                            height: heights.universityFlowHeight
                        },
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
                        position: { x: 550/2.5, y: heights.preuniversityFlowHeight/9 },
                        type: 'roadmap',
                        data: { label: 'Pre-University', category: 'preuniversity', },
                        parentId: 'subflow-3',
                        extent: 'parent'
                    },
                    {
                        id: 'preuniversity-stpm',
                        position: { x: 100, y: 20 },
                        type: 'roadmap',
                        data: { label: 'STPM', category: 'preuniversity-item',},
                        parentId: 'subflow-3',
                        extent: 'parent'
                    },
                    {
                        id: 'preuniversity-matrik',
                        position: { x: 400, y: 20 },
                        type: 'roadmap',
                        data: { label: 'Matriculation', category: 'preuniversity-item',},
                        parentId: 'subflow-3',
                        extent: 'parent'
                    },
                    {
                        id: 'preuniversity-diploma',
                        position: { x: 70, y: (heights.preuniversityFlowHeight/2) },
                        type: 'roadmap',
                        data: { label: 'Diploma', category: 'preuniversity-item',},
                        parentId: 'subflow-3',
                        extent: 'parent'
                    },
                    {
                        id: 'preuniversity-foundation',
                        position: { x: 400, y: (heights.preuniversityFlowHeight/2) - (heights.preuniversityFlowHeight/5) },
                        type: 'roadmap',
                        data: { label: 'Foundation', category: 'preuniversity-item',},
                        parentId: 'subflow-3',
                        extent: 'parent'
                    },
                    {
                        id: 'title-domain',
                        position: { x: 1550, y: -60 },
                        type: 'domain',
                        data: { label: 'Domain', category: 'domain', domain: domain },
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


                const edges: Edge[] = [
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

                // Push Data
                prerequisites.forEach((prerequisite: Prerequisite, index: number) => {
                    nodes.push({
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

                personas.forEach((persona: Persona, index: number) => {
                    nodes.push({
                        id: `persona-${persona.id}`,
                        position: { x: 120, y: 60 + (index * 200) },
                        type: 'persona',
                        data: { label: persona.name, category: 'persona', persona: persona },
                        parentId: 'subflow-2',
                        extent: 'parent'
                    });
                });

                nodes.push({
                    id: `${foundationCourse.id}`,
                    position: { x: 270, y: (heights.preuniversityFlowHeight/2) },
                    type: 'foundation',
                    data: { label: foundationCourse.institution_name, category: 'preuniversity', foundation: foundationCourse },
                    parentId: 'subflow-3',
                    extent: 'parent'
                });

                nodes.push({
                    id: `${diplomaCourse.id}`,
                    position: { x: 20, y: (heights.preuniversityFlowHeight/2) + (heights.preuniversityFlowHeight/4.5) },
                    type: 'diploma',
                    data: { label: diplomaCourse.institution_name, category: 'preuniversity', diploma: diplomaCourse },
                    parentId: 'subflow-3',
                    extent: 'parent'
                });

                nodes.push({
                    id: `university-name-${universityCourses.id}`,
                    position: { x: 100, y: 90 },
                    type: 'roadmap',
                    data: { label: universityCourses.institution_name, category: 'university', },
                    parentId: 'subflow-4',
                    extent: 'parent'
                });

                universityCourses.courses.forEach((course: UniversalCourse, index: number) => {
                    nodes.push({
                        id: `university-${course.id}`,
                        position: { x: 150, y: 150 + (index * 200) },
                        type: 'university',
                        data: { label: course.course_name, category: 'university', university: course },
                        parentId: 'subflow-4',
                        extent: 'parent'
                    });
                });

                // push edges
                prerequisites.forEach((prerequisite: Prerequisite, index: number) => {
                    edges.push({
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

                personas.forEach((persona: Persona, index: number) => {
                    edges.push({
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

                edges.push({
                    id: `foundation-edge-${foundationCourse.id}`,
                    source: 'preuniversity-foundation',
                    target: `${foundationCourse.id}`,
                    type: 'preuniversity',
                    sourceHandle: 'bottom-source',
                    targetHandle: 'top-target',
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
                    animated: true
                });

                edges.push({
                    id: `diploma-edge-${diplomaCourse.id}`,
                    source: 'preuniversity-diploma',
                    target: `${diplomaCourse.id}`,
                    type: 'preuniversity',
                    sourceHandle: 'bottom-source',
                    targetHandle: 'top-target',
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#A855F7' },
                    animated: true
                });

                edges.push({
                    id: `university-title-edge-${universityCourses.id}`,
                    source: 'title-university',
                    target: `university-name-${universityCourses.id}`,
                    type: 'university',
                    sourceHandle: 'bottom-source',
                    targetHandle: 'left-target',
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#F59E0B' },
                    animated: true
                });

                universityCourses.courses.forEach((course: UniversalCourse, index: number) => {
                    edges.push({
                        id: `university-edge-${course.id}`,
                        target: `university-${course.id}`,
                        source: `university-name-${universityCourses.id}`,
                        type: 'university',
                        sourceHandle: 'right-source',
                        targetHandle: 'right-target',
                        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#F59E0B' },
                        animated: true
                    });
                });

                setFlowData({ nodes, edges });
                setRoadmap(roadmap);
            } catch (err) {
                console.error('Error fetching roadmap data:', err);
                setError(err instanceof Error ? err : new Error('An error occurred while fetching roadmap data'));
                return; // Exit early if there's an error
            } finally {
                setIsLoading(false);
            }
        }

        if(id) {
            fetchData();
        }
    }, [id]);

    return { flowData, roadmap, isLoading, error };
}
