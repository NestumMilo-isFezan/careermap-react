import { ExcelFileUploader } from '@/Components/shadcn/Form/ExcelFileUploader';
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import axios from 'axios';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { Domain } from '@/types';
import { SelectOption } from '@/Components/shadcn/Form/Components';
import { router } from '@inertiajs/react';

interface CourseData {
    course_name: string;
    faculty_name: string;
    domain_id: number | null;
    course_level: string | null;
    institution_name: string;
    description?: string;
}

interface FormProps {
    domains: Domain[];
}

// Define course level options
const courseLevelOptions = [
    { label: 'Foundation', value: 'Foundation' },
    { label: 'Diploma', value: 'Diploma' },
    { label: 'Bachelor', value: 'Bachelor' },
    { label: 'Master', value: 'Master' },
    { label: 'Doctorate', value: 'Doctorate' }
];

export const CourseForm = ({ domains }: FormProps) => {
    const [previewData, setPreviewData] = useState<CourseData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Convert domains to select options format - Move outside component or use useMemo
    const domainOptions = domains.map(domain => ({
        label: domain.name,
        value: domain.id.toString()
    }));

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            setPreviewData([]);
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(route('admin.course.preview'), formData);
            setPreviewData(response.data.courses);
            console.log('File processed successfully');
        } catch (error) {
            console.error('Failed to parse Excel file');
            setPreviewData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async () => {
        if (!previewData.length) return;

        try {
            await axios.post(route('admin.course.import'), {
                courses: previewData.map(course => ({
                    ...course,
                    domain_id: parseInt(course.domain_id?.toString() ?? '0')
                }))
            });
            console.log('Courses imported successfully');
            setPreviewData([]);
            router.get(route('admin.course.index'));
        } catch (error) {
            console.error('Failed to import courses');
        }
    };

    const handleDomainChange = (courseIndex: number, value: string) => {
        setPreviewData(prev => prev.map((course, index) =>
            index === courseIndex
                ? { ...course, domain_id: parseInt(value) }
                : course
        ));
    };

    const handleLevelChange = (courseIndex: number, value: string) => {
        setPreviewData(prev => prev.map((course, index) =>
            index === courseIndex
                ? { ...course, course_level: value }
                : course
        ));
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-row items-center gap-4 w-full">
                <div className="w-full px-4">
                    <ExcelFileUploader
                        onFileChange={handleFileChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {previewData.length > 0 && (
                <div className="space-y-2">
                    <ScrollArea className="h-[42vh] px-4 pb-8">
                        <h3 className="text-lg font-medium text-emerald-800">Preview Data</h3>
                        <div className="border border-primary rounded-xl h-full">
                            <Table>
                            <TableHeader>
                                <TableRow className="bg-emerald-500 hover:bg-emerald-600/80 transition-colors">
                                    <TableHead className="text-emerald-50 font-bold first:rounded-tl-lg">Course Name</TableHead>
                                    <TableHead className="text-emerald-50 font-bold">Faculty</TableHead>
                                    <TableHead className="text-emerald-50 font-bold">Domain ID</TableHead>
                                    <TableHead className="text-emerald-50 font-bold">Level</TableHead>
                                    <TableHead className="text-emerald-50 font-bold last:rounded-tr-lg">Institution</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {previewData.map((course, index) => (
                                    <TableRow
                                        key={`${course.course_name}-${index}`}
                                        className={`
                                            ${index % 2 === 0 ? 'bg-yellow-100/50 hover:bg-yellow-200/50' : 'bg-emerald-100/50 hover:bg-emerald-200/50'}
                                            transition-colors
                                        `}
                                    >
                                        <TableCell className="text-emerald-600">{course.course_name}</TableCell>
                                        <TableCell className="text-emerald-600">{course.faculty_name}</TableCell>
                                        <TableCell>
                                            <SelectOption
                                                value={course.domain_id?.toString() ?? '0'}
                                                onValueChange={(value) => handleDomainChange(index, value)}
                                                options={domainOptions}
                                                placeholder="Select Domain"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <SelectOption
                                                value={course.course_level ?? ''}
                                                onValueChange={(value) => handleLevelChange(index, value)}
                                                options={courseLevelOptions}
                                                placeholder="Select Level"
                                            />
                                        </TableCell>
                                        <TableCell className="text-emerald-600">{course.institution_name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                    <div className="w-full px-4">
                        <Button
                            onClick={handleImport}
                            size="lg"
                            className="w-full"
                            disabled={isLoading}
                        >
                            Import Courses
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
