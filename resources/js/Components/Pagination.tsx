import {Link} from '@inertiajs/react';
import { Meta, Links } from '@/types';
import { cn } from '@/shadcn/lib/utils';

export default function Pagination({meta}: {meta: Meta}) {
    return (
        <div className="flex gap-2">
            {meta.links.map((link: Links) => {
                if (link.url) {
                    return (
                        <Link
                            preserveScroll
                            href={link.url}
                            key={link.label}
                            className={cn(
                                'inline-block py-2 px-3 rounded-md text-xs border',
                                !link.active ? 'border-primary text-primary' : 'bg-sidebar border-primary text-sidebar-foreground'
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></Link>
                    );
                }

                return (
                    <span
                        key={link.label}
                        className={cn(
                            'inline-block py-2 px-3 rounded-md text-xs border',
                            !link.active ? 'cursor-not-allowed bg-gray-100 border-gray-600/50 text-gray-400' : 'bg-sidebar border-primary text-sidebar-foreground'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    ></span>
                );
            })}
        </div>
    )
}
