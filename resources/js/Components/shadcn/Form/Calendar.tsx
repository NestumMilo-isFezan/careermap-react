import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";

// UI Components
import { Popover, PopoverTrigger, PopoverContent } from "@/shadcn/components/ui/popover";
import { Button } from "@/shadcn/components/ui/button";
import { Calendar } from "@/shadcn/components/ui/calendar";
import { Label } from "@/shadcn/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/components/ui/select";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

// Types
interface DatePickerProps {
    date: string;
    onDateChange: (date: string) => void;
    errorMessage?: string;
    label?: string;
    disabled?: boolean;
}

// Constants
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
};

// Components
const MonthSelect = ({ month, onMonthChange }: {
    month: Date;
    onMonthChange: (value: string) => void;
}) => (
    <Select
        value={month.getMonth().toString()}
        onValueChange={onMonthChange}
    >
        <SelectTrigger className="h-7 bg-stone-50 border border-emerald-500">
            <SelectValue>{format(month, "MMMM")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
            {MONTHS.map((monthName, index) => (
                <SelectItem key={monthName} value={index.toString()}>{monthName}</SelectItem>
            ))}
        </SelectContent>
    </Select>
);

const YearSelect = ({ month, onYearChange }: {
    month: Date;
    onYearChange: (value: string) => void;
}) => (
    <Select
        value={month.getFullYear().toString()}
        onValueChange={onYearChange}
    >
        <SelectTrigger className="h-7 bg-stone-50 border border-emerald-500">
            <SelectValue>{format(month, "yyyy")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
            <ScrollArea className="h-80">
                {generateYearRange().map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
            </ScrollArea>
        </SelectContent>
    </Select>
);

export const DatePicker = ({
    date,
    onDateChange,
    errorMessage,
    label = "Birth Date",
    disabled = false
}: DatePickerProps) => {
    const [month, setMonth] = useState<Date>(date ? new Date(date) : new Date());
    const [open, setOpen] = useState(false);

    const handleMonthChange = (value: string) => {
        setMonth(new Date(month.getFullYear(), parseInt(value), 1));
    };

    const handleYearChange = (value: string) => {
        setMonth(new Date(parseInt(value), month.getMonth(), 1));
    };

    const handleSelect = (date: Date | undefined) => {
        onDateChange(date ? date.toISOString() : '');
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-emerald-800">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled={disabled}
                        className={cn(
                            "pl-3 text-left font-normal w-full py-4 border-emerald-500 bg-stone-50",
                            "focus:border-emerald-500 focus:ring-emerald-500",
                            !date && "text-emerald-500 placeholder:text-emerald-500",
                            date && "text-emerald-800",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-emerald-800" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-stone-50 border border-emerald-500" align="center">
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex space-x-1">
                            <MonthSelect month={month} onMonthChange={handleMonthChange} />
                            <YearSelect month={month} onYearChange={handleYearChange} />
                        </div>
                        <Calendar
                            mode="single"
                            selected={date ? new Date(date) : undefined}
                            onSelect={handleSelect}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            month={month}
                            onMonthChange={setMonth}
                            initialFocus
                            className="border-emerald-500"
                        />
                    </div>
                </PopoverContent>
            </Popover>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    );
};
