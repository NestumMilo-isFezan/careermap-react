import * as React from 'react';
import { useHover } from '@/shadcn/hooks/use-hover';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';

interface HoverPopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    delayEnter?: number;
    delayLeave?: number;
}

export function HoverPopover({ trigger, content, delayEnter = 100, delayLeave = 100 }: HoverPopoverProps) {
    const { ref, isHovered, handleMouseEnter, handleMouseLeave } = useHover<HTMLDivElement>(delayEnter, delayLeave);

    return (
        <Popover open={isHovered}>
            <PopoverTrigger asChild>
                <div
                    ref={ref}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {trigger}
                </div>
            </PopoverTrigger>
            <PopoverContent
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                side="top"
                align="start"
                className="bg-transparent border-none shadow-none"
            >
                {content}
            </PopoverContent>
        </Popover>
    );
}
