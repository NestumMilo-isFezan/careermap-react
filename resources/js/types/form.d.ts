import { Page } from '@inertiajs/core'
import { FormEventHandler } from 'react'

export interface FormProps<TForm> {
    data: TForm
    setData: (key: keyof TForm, value: any) => void
    post: (url: string, options?: { onSuccess?: () => void }) => void
    processing: boolean
    errors: Partial<Record<keyof TForm, string>>
    reset: (...fields: (keyof TForm)[]) => void
}

export interface Subject {
    id: number;
    name: string;
    short_name: string;
}
