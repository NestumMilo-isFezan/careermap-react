import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { cn } from '@/shadcn/lib/utils';

export type RoadmapSubFlowNode = Node<{
    label?: string;
    category?: 'subject' | 'persona' | 'domain' | 'university' | 'course';
    width?: number;
    height?: number;
}>;

export default function RoadmapSubFlowNode({ data }: NodeProps<RoadmapSubFlowNode>) {
    const categoryStyle = {
        'subject': 'bg-emerald-50/30 border-emerald-600',
        'persona': 'bg-rose-50/30 border-rose-600',
        'domain': 'bg-sky-50/30 border-sky-600',
        'university': 'bg-amber-50/30 border-amber-600',
        'course': 'bg-lime-50/30 border-lime-600',
        'preuniversity': 'bg-purple-50/30 border-purple-600',
    } as const;

    return (
        <div className="relative">
            <Handle
                type="source"
                position={Position.Left}
                style={{ visibility: 'hidden' }}
                id="left-source"
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ visibility: 'hidden'}}
                id="left-target"
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ visibility: 'hidden' }}
                id="right-source"
            />
            <Handle
                type="target"
                position={Position.Right}
                style={{ visibility: 'hidden' }}
                id="right-target"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ visibility: 'hidden' }}
                id="bottom-source"
            />
            <Handle
                type="target"
                position={Position.Bottom}
                style={{ visibility: 'hidden' }}
                id="bottom-target"
            />
            <Handle
                type="source"
                position={Position.Top}
                style={{ visibility: 'hidden' }}
                id="top-source"
            />
            <Handle
                type="target"
                position={Position.Top}
                style={{ visibility: 'hidden' }}
                id="top-target"
            />
            <div className={cn(
                "flex flex-col items-center gap-2 p-2 rounded-md border",
                categoryStyle[data.category ?? 'subject']
            )}
            style={{
                width: data.width ?? 550,
                height: data.height ?? 200,
            }}
            >
            </div>
        </div>
    );
}
