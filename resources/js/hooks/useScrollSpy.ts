import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const handler = () => {
            const elements = ids.map(id => document.getElementById(id));

            // Find the element that is currently in view
            const found = elements.find((element) => {
                if (!element) return false;

                const rect = element.getBoundingClientRect();
                return rect.top <= offset && rect.bottom >= offset;
            });

            setActiveId(found?.id || '');
        };

        handler(); // Call once immediately
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, [ids, offset]);

    return activeId;
}
