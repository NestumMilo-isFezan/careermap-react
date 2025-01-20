import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/shadcn/components/ui/label';
import { Button } from '@/shadcn/components/ui/button';
import { FileUp, X, FileCheck } from 'lucide-react';

interface DocumentUploadFieldProps {
    accept?: string;
    onFileChange: (file: File | null) => void;
    label?: string;
    hint?: string;
    errorMessage?: string;
}

export function DocumentUploadField({
    accept = ".pdf,.doc,.docx",
    onFileChange,
    label,
    hint,
    errorMessage,
}: DocumentUploadFieldProps) {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            onFileChange(acceptedFiles[0]);
        }
    }, [onFileChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    const removeFile = () => {
        setFile(null);
        onFileChange(null);
    };

    const getFileTypeBadge = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const badgeClasses = "px-2 py-0.5 text-xs rounded-full";

        switch (extension) {
            case 'pdf':
                return <span className={`${badgeClasses} bg-red-100 text-red-700`}>PDF</span>;
            case 'doc':
            case 'docx':
                return <span className={`${badgeClasses} bg-blue-100 text-blue-700`}>DOC</span>;
            default:
                return null;
        }
    };

    const truncateFileName = (fileName: string, maxLength: number = 50) => {
        if (fileName.length <= maxLength) return fileName;
        if (fileName.includes('/storage/curriculums/')) {
            // remove the /storage/curriculums/
            fileName = fileName.replace('/storage/curriculums/', '');
            return fileName;
        }
        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
        return `${nameWithoutExt.slice(0, maxLength - 3)}...${extension}`;
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <Label className="text-emerald-800">{label}</Label>}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer
                    ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200'}
                    transition-colors duration-200 hover:border-emerald-500 hover:bg-emerald-50`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    <FileUp className="w-12 h-12 text-emerald-500 mb-2" />
                    {isDragActive ? (
                        <p className="text-emerald-600">Drop the file here</p>
                    ) : (
                        <>
                            <p className="text-emerald-600 font-medium">
                                Drag & drop your document here
                            </p>
                            <p className="text-emerald-500 text-sm mt-1">
                                or click to select a file
                            </p>
                        </>
                    )}
                </div>
            </div>

            {file && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-md border border-emerald-200">
                    <div className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-emerald-700 text-sm">
                            {truncateFileName(file.name)}
                        </span>
                        {getFileTypeBadge(file.name)}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    );
}
