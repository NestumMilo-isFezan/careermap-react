// Types
import { SelectInterface, FormFieldInterface } from './form.d';

// UI Components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue ,
} from '@/shadcn/components/ui/select';
import { Label } from '@/shadcn/components/ui/label';
import { Input } from '@/shadcn/components/ui/input';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useEffect, useRef } from 'react';
import { cn } from '@/shadcn/lib/utils';

interface FormFieldProps {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    errorMessage?: string;
    type?: string;
    disabled?: boolean;
    className?: string;
    autoResize?: boolean;
    required?: boolean;
    autoComplete?: string;
    isFocused?: boolean;
    // ... any other existing props
}

export function FormField({
    label,
    value = '',
    onChange,
    errorMessage,
    type = 'text',
    disabled = false,
    className = '',
    autoResize = false,
    required = false,
    autoComplete = '',
    isFocused = false,
    ...props
}: FormFieldProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (textareaRef.current && autoResize) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (type === 'textarea' && autoResize) {
            adjustHeight();
        }
    }, [value, type, autoResize]);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-emerald-800 mb-1">
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange?.(e.target.value);
                        if (autoResize) {
                            adjustHeight();
                        }
                    }}
                    disabled={disabled}
                    className={cn(
                        "w-full rounded-md border border-emerald-500 bg-stone-50 px-3 py-2",
                        "text-sm placeholder:text-emerald-500",
                        "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-900/50",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        errorMessage && "border-red-500",
                        className
                    )}
                    required={required}
                    autoComplete={autoComplete}
                    autoFocus={isFocused}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-full rounded-md border border-emerald-500 bg-stone-50 px-3 py-2",
                        "text-sm placeholder:text-emerald-500",
                        "focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-900/50",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        errorMessage && "border-red-500",
                        className
                    )}
                    required={required}
                    autoComplete={autoComplete}
                    autoFocus={isFocused}
                    {...props}
                />
            )}
            {errorMessage && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}

export const SelectOption = ({
    label,
    placeholder,
    value,
    onValueChange,
    options,
    errorMessage,
    disabled,
    instructions
}: SelectInterface) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row justify-between">
                <Label className="text-emerald-800">{label}</Label>
                {instructions && (
                    <span className="text-sm text-emerald-500">{instructions}</span>
                )}
            </div>
            <Select
                value={value}
                onValueChange={(value) => onValueChange(value)}
                disabled={disabled}
            >
                <SelectTrigger className="border-emerald-500 bg-stone-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-900">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="border-emerald-500 bg-stone-50">
                    <SelectGroup>
                        <SelectLabel className="text-emerald-800">{label}</SelectLabel>
                            {value === '0' && (
                                <SelectItem value="0">{placeholder}</SelectItem>
                            )}
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    )
}
