import { Label } from '@/shadcn/components/ui/label';
import { Input } from '@/shadcn/components/ui/input';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { Button } from '@/shadcn/components/ui/button';
import { Calendar } from "@/shadcn/components/ui/calendar";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shadcn/lib/utils';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from '@/shadcn/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import { useState, useCallback, useRef } from 'react';
import React, { type SyntheticEvent } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CropIcon, Trash2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";

// Helper function to center the crop
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 50,
                height: 50,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

// Progress Steps Component
export const ProgressSteps = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { step: 1, label: 'Personal Info' },
        { step: 2, label: 'School Details' },
        { step: 3, label: 'Academic Records' }
    ];

    return (
        <div className="mb-8 px-4">
            <div className="flex justify-between">
                {steps.map(({ step, label }) => (
                    <div
                        key={step}
                        className={`flex flex-col items-center ${
                            currentStep >= step ? 'text-emerald-600' : 'text-gray-300'
                        }`}
                    >
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            text-sm font-medium mb-2 relative
                            ${currentStep > step
                                ? 'bg-emerald-100 text-emerald-600'
                                : currentStep === step
                                ? 'bg-emerald-500 text-white animate-pulse ring-2 ring-emerald-500 ring-opacity-50'
                                : 'bg-gray-100 text-stone-500 border border-stone-500'
                            }
                            ${currentStep === step && 'after:absolute after:w-14 after:h-14 after:rounded-full after:bg-emerald-500/20 after:animate-ping'}
                        `}>
                            {step}
                        </div>
                        <span className={`text-sm hidden sm:block ${
                            currentStep === step ? 'font-medium' : ''
                        }`}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Profile Banner Component
export const ProfileBanner = ({ user, profileImage, onImageChange, formMode, processing, errorMessage }: {
    user: any;
    profileImage: string;
    onImageChange: (imageUrl: string | File) => void;
    formMode: string;
    processing?: boolean;
    errorMessage?: string;
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
    const [croppedImage, setCroppedImage] = useState<string>("");
    const imgRef = useRef<HTMLImageElement | null>(null);

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    }

    function onCropComplete(crop: PixelCrop) {
        if (imgRef.current && crop.width && crop.height) {
            const croppedUrl = getCroppedImg(imgRef.current, crop);
            setCroppedImageUrl(croppedUrl);
        }
    }

    function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY,
            );
        }

        return canvas.toDataURL("image/jpeg", 0.95);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            onImageChange(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppedImage(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };

    async function onCrop() {
        try {
            setCroppedImage(croppedImageUrl);
            onImageChange(croppedImageUrl);
            setIsModalOpen(false);
            setSelectedFile(null);
        } catch (error) {
            console.error("Cropping failed:", error);
        }
    }

    return (
        <div className="relative flex flex-col top-0 items-center">
            <div className="w-full h-28 rounded-t-md bg-gradient-to-r from-violet-400 via-pink-300 to-cyan-300" />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                {formMode === "create" ? (
                    <label className="group cursor-pointer block relative">
                        <div className="size-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                            />
                            <div className="absolute -bottom-1 -left-1 size-8 bg-emerald-500 rounded-full border-2 border-white
                                flex items-center justify-center text-white transition-all duration-300
                                group-hover:bg-emerald-600 z-10"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0
                                transition-opacity duration-300 group-hover:opacity-100 rounded-full"
                            >
                                <span className="text-white text-xs font-medium">Upload Photo</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </label>
                ) : (
                    <div className="size-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                        />
                    </div>
                )}

                <div className="mt-3 text-center">
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                    <h2 className="text-lg md:text-xl font-bold text-emerald-800">{user.name}</h2>
                    <p className="text-sm text-emerald-600">{user.email}</p>
                </div>
            </div>
            <div className="h-20"></div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[800px] w-[90vw] p-0 h-[80vh] flex flex-col bg-emerald-50 border border-emerald-500">
                    <DialogHeader className="p-4 pt-6">
                        <DialogTitle>Crop Image</DialogTitle>
                        <DialogDescription>
                            Drag to move and resize the crop area
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col px-2">
                        <div className="px-4 flex-1 overflow-y-auto bg-stone-900 rounded-lg">
                            {selectedFile && (
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 flex items-center justify-center p-4">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                                            onComplete={(c) => onCropComplete(c)}
                                            aspect={1}
                                            circularCrop
                                            className="max-h-[60vh] w-auto"
                                        >
                                            <img
                                                ref={imgRef}
                                                src={croppedImage}
                                                alt="Crop preview"
                                                onLoad={onImageLoad}
                                                className="max-h-[60vh] w-auto object-contain"
                                                style={{ maxWidth: 'none' }}
                                            />
                                        </ReactCrop>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t mt-auto">
                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setIsModalOpen(false);
                                    }}
                                    variant="outline"
                                    className="bg-white"
                                >
                                    <Trash2Icon className="mr-1.5 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onCrop}
                                    variant="default"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                    disabled={!crop}
                                >
                                    <CropIcon className="mr-1.5 h-4 w-4" />
                                    Crop
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Date Picker Component
export const DatePicker = ({ date, onDateChange }: {
    date: string;
    onDateChange: (date: string) => void;
}) => {
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
    const [month, setMonth] = useState<Date>(new Date());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div>
            <Label>Birth Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "pl-3 text-left font-normal w-full py-4 border-emerald-500 bg-stone-50 focus:border-emerald-500 focus:ring-emerald-500 text-emerald-500",
                            !date && "text-muted-foreground"
                        )}
                    >
                        {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-stone-50 border border-emerald-500" align="center">
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex space-x-1">
                            {/* Month and Year selectors */}
                            <Select
                                value={month.getMonth().toString()}
                                onValueChange={(value) => setMonth(new Date(month.getFullYear(), parseInt(value), 1))}
                            >
                                <SelectTrigger className="h-7 bg-stone-50 border border-emerald-500">
                                    <SelectValue>{format(month, "MMMM")}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month, index) => (
                                        <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={month.getFullYear().toString()}
                                onValueChange={(value) => setMonth(new Date(parseInt(value), month.getMonth(), 1))}
                            >
                                <SelectTrigger className="h-7 bg-stone-50 border border-emerald-500">
                                    <SelectValue>{format(month, "yyyy")}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-80">
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <Calendar
                            mode="single"
                            selected={date ? new Date(date) : undefined}
                            onSelect={e => onDateChange(e ? e.toISOString() : '')}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            month={month}
                            initialFocus
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

// Submit Button Component
export const SubmitButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500
            text-white rounded-xl font-medium transition-all duration-200
            hover:from-emerald-600 hover:to-teal-600 focus:ring-2 focus:ring-emerald-200"
        >
            {children}
        </button>
    );
};

interface FormFieldProps {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const FormField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    className = ""
}: FormFieldProps) => {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {type === "textarea" ? (
                <Textarea
                    placeholder={placeholder || label}
                    className={`border-emerald-500 bg-stone-50 focus:border-emerald-500 placeholder:text-emerald-500 focus:ring-emerald-500 ${className}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder || label}
                    className={`border-emerald-500 bg-stone-50 focus:border-emerald-500 placeholder:text-emerald-500 focus:ring-emerald-500 ${className}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            )}
        </div>
    );
};
