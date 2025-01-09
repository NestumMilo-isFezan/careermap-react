import { Avatar, AvatarImage, AvatarFallback } from '@/shadcn/components/ui/avatar';
import { Roadmap } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle,
  } from '@xyflow/react';
import { useCallback } from 'react';

function UserNode(){
    const user = usePage().props.auth.user ? usePage().props.auth.user : null;
    return (
        <>
            <Handle type="source" position={Position.Bottom} />
            <div className="flex flex-col items-center gap-2">
                <Avatar className="w-6 h-6 rounded-full">
                    <AvatarImage src={user?.image ?? ''} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{user?.name}</p>
            </div>
        </>
    );
}

export default function ViewModal({ roadmap }: { roadmap: Roadmap }) {
    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'User' }, type: 'user' },
        { id: '2', position: { x: 0, y: 100 }, data: { label: 'Test 2' } },
    ];

    const initialEdges = [
        { id: 'e1-2', source: '1', target: '2' },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="w-full h-full">
            <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView />
        </div>
    );
}
