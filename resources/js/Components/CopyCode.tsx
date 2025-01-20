import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyCodeProps {
    textToCopy: string;
    buttonLabel?: string;
    content?: React.ReactNode;
}

const CopyCode: React.FC<CopyCodeProps> = ({
    textToCopy,
    buttonLabel = 'Copy',
    content
}) => {
    const [copyNotification, setCopyNotification] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopyNotification(true);
            setTimeout(() => {
                setCopyNotification(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-700">
                {content && (
                    <div className="flex-1 p-3 text-sm bg-yellow-100/50 rounded-md text-gray-600">
                        {content}
                    </div>
                )}
            </div>
            <div className="flex items-start gap-2">
                {content && (
                    <div className="flex-1 p-3 text-sm bg-yellow-100/50 rounded-md text-gray-600">
                        {content}
                    </div>
                )}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center h-8 px-3 py-1 text-xs bg-white border rounded-md cursor-pointer border-emerald-200 hover:bg-emerald-50 active:bg-white focus:bg-white focus:outline-none text-emerald-600 hover:text-emerald-700 group shrink-0"
                >
                    {!copyNotification ? (
                        <>
                            <span>{buttonLabel}</span>
                            <Copy className="w-3.5 h-3.5 ml-1.5 stroke-current" />
                        </>
                    ) : (
                        <>
                            <span className="tracking-tight text-emerald-500">
                                Copied
                            </span>
                            <Check className="w-3.5 h-3.5 ml-1.5 text-emerald-500 stroke-current" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CopyCode;
