import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/shadcn/components/ui/label';
import { Button } from '@/shadcn/components/ui/button';
import { FileSpreadsheet, X, Upload, Loader2 } from 'lucide-react';

interface ExcelFileUploaderProps {
    onFileChange: (file: File | null) => void;
    label?: string;
    hint?: string;
    errorMessage?: string;
    isLoading?: boolean;
}

export const ExcelFileUploader = ({
    onFileChange,
    label = "Upload Excel File",
    hint = "Upload an Excel file to bulk import courses. The Excel should have columns: name, description, level, and faculty",
    errorMessage,
    isLoading
}: ExcelFileUploaderProps) => {
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
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1
    });

    const removeFile = () => {
        setFile(null);
        onFileChange(null);
    };

    if (isLoading) {
        return <div className="flex flex-col gap-2">
            <Label className="text-emerald-800">{label}</Label>
            <div className="flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 mb-2" />
                <p className="text-emerald-600 font-medium">Loading...</p>
            </div>
        </div>
    }

    return (
        <div className="flex flex-col gap-2">
            {label && <Label className="text-emerald-800">{label}</Label>}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 cursor-pointer
                    ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200'}
                    transition-colors duration-200 hover:border-emerald-500 hover:bg-emerald-50
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    {file ? (
                        <>
                            <FileSpreadsheet className="w-12 h-12 text-emerald-500 mb-2" />
                            <p className="text-emerald-600 font-medium">{file.name}</p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="text-red-500 hover:text-red-700 mt-2"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove File
                            </Button>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-emerald-500 mb-2" />
                            {isDragActive ? (
                                <p className="text-emerald-600">Drop the Excel file here</p>
                            ) : (
                                <>
                                    <p className="text-emerald-600 font-medium">
                                        Drag & drop your Excel file here
                                    </p>
                                    <p className="text-emerald-500 text-sm mt-1">
                                        or click to select a file
                                    </p>
                                </>
                            )}
                            {hint && (
                                <p className="text-emerald-500/80 text-xs mt-2 max-w-sm">
                                    {hint}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    );
}
