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
                <SelectTrigger className="border-emerald-500 bg-stone-50 focus:border-emerald-500 focus:ring-emerald-500">
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

export const FormField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    className = "",
    errorMessage,
    disabled,
    autoComplete,
    isFocused,
    required
}: FormFieldInterface) => {
    return (
        <div className={'flex flex-col gap-2 ' + className}>
            <Label className="text-emerald-800">{label}</Label>
            {type === "textarea" ? (
                <Textarea
                    placeholder={placeholder || label}
                    className={`border-emerald-500 bg-stone-50 focus:border-emerald-500 placeholder:text-emerald-500 focus:ring-emerald-500 ${className}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    autoFocus={isFocused}
                    required={required}
                />
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder || label}
                    className={`border-emerald-500 bg-stone-50 focus:border-emerald-500 placeholder:text-emerald-500 focus:ring-emerald-500 ${className}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    required={required}
                    autoFocus={isFocused}
                />
            )}
            {errorMessage && (
                <p className="text-red-500 text-xs mb-3">{errorMessage}</p>
            )}
        </div>
    );
};
