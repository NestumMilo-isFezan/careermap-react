import { useState, useRef } from 'react';
import React, { type SyntheticEvent } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import { Label } from "@/shadcn/components/ui/label";
import { CropIcon, Trash2Icon } from "lucide-react";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
                height: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

interface UploadImageFieldProps {
    label?: string;
    imagePath: string;
    onImageChange: (imageUrl: string | File) => void;
    errorMessage?: string;
    cropStyle?: 'landscape' | 'profile';
    circle?: boolean;
}

export const UploadImageField = ({
    label,
    imagePath,
    onImageChange,
    errorMessage,
    cropStyle = 'landscape',
    circle = false
}: UploadImageFieldProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
    const [croppedImage, setCroppedImage] = useState<string>("");
    const imgRef = useRef<HTMLImageElement | null>(null);

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const aspect = cropStyle === 'landscape' ? 16 / 9 : 1;
        setCrop(centerAspectCrop(width, height, aspect));
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

        return canvas.toDataURL("image/jpeg", 1.0);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result as string;
                setCroppedImage(imageDataUrl);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };

    async function onCrop() {
        try {
            if (croppedImageUrl) {
                setCroppedImage(croppedImageUrl);
                onImageChange(croppedImageUrl);
                setIsModalOpen(false);
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Cropping failed:", error);
        }
    }

    return (
        <div className="flex flex-col w-full gap-2">
            <Label className="text-emerald-800">{label}</Label>
            <div className="flex flex-col items-center w-full">
                <label className={`w-full group cursor-pointer block relative ${circle ? 'aspect-square' : ''}`}>
                    <div className={`w-full border-4 border-white bg-white overflow-hidden
                        ${cropStyle === 'profile' ? 'aspect-square' : 'h-[24vh]'}
                        ${circle ? 'rounded-full' : 'rounded-md'}`}
                    >
                        <img
                            src={croppedImage || imagePath}
                            alt="Profile"
                            className={`w-full h-full transition duration-300 group-hover:scale-110 object-cover
                                ${circle ? 'rounded-full' : ''}`}
                        />
                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0
                            transition-opacity duration-300 group-hover:opacity-100
                            ${circle ? 'rounded-full' : 'rounded-md'}`}
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
                {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                )}
            </div>

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
                                        <div className="relative max-w-full max-h-[60vh]">
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                onComplete={(c) => onCropComplete(c)}
                                                aspect={cropStyle === 'landscape' ? 16 / 9 : 1}
                                                className="max-h-[60vh]"
                                            >
                                                <img
                                                    ref={imgRef}
                                                    src={croppedImage}
                                                    alt="Crop preview"
                                                    onLoad={onImageLoad}
                                                    className="max-h-[60vh] w-auto"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </ReactCrop>
                                        </div>
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
