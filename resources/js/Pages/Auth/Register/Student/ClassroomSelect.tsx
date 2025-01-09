import { Label } from '@/shadcn/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from '@/shadcn/components/ui/select';

interface ClassroomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    classrooms: any[];
    disabled?: boolean;
}

export default function ClassroomSelect({
    value,
    onValueChange,
    classrooms,
    disabled
}: ClassroomSelectProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label>Classroom</Label>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger className="py-4 border-emerald-500 bg-stone-50">
                    <SelectValue placeholder="Select Classroom" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Classrooms</SelectLabel>
                        {classrooms.map((classroom) => (
                            <SelectItem
                                key={classroom.id}
                                value={classroom.id.toString()}
                            >
                                {classroom.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
