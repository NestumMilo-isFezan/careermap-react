import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';


  export type UserNode = Node<{
    label: string;
    color?: string;
  }>;

  export default function UserNode({ data }: NodeProps<UserNode>) {
    const user = usePage().props.auth.user ? usePage().props.auth.user : null;
    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <div className="relative">
                <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden', bottom: '5px' }} id="bottom-source"/>
                <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden', bottom: '5px' }} id="bottom-target"/>
                <Handle type="source" position={Position.Top} style={{ visibility: 'hidden', top: '5px' }} id="top-source"/>
                <Handle type="target" position={Position.Top} style={{ visibility: 'hidden', top: '5px' }} id="top-target"/>
                <Handle type="source" position={Position.Left} style={{ visibility: 'hidden', left: '5px' }} id="left-source"/>
                <Handle type="target" position={Position.Left} style={{ visibility: 'hidden', left: '5px' }} id="left-target"/>
                <Handle type="source" position={Position.Right} style={{ visibility: 'hidden', right: '5px' }} id="right-source"/>
                <Handle type="target" position={Position.Right} style={{ visibility: 'hidden', right: '5px' }} id="right-target"/>
                <div className="rounded-full bg-emerald-500 p-1 flex items-center justify-center">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.image ?? ''} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <p className="text-sm font-bold font-mono text-emerald-900">{user?.first_name}</p>
        </div>
    );
  }
