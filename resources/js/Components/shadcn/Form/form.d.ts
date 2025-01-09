export interface SelectInterface {
    label?: string;
    placeholder?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: {
        label: string;
        value: string;
    }[];
    errorMessage?: string;
    disabled?: boolean;
    instructions?: string;
}

interface FormFieldInterface {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    errorMessage?: string;
    disabled?: boolean;
    autoComplete?: string;
    isFocused?: boolean;
    required?: boolean;
}
