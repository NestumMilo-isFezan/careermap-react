import { useForm } from '@inertiajs/react';
import { FormField } from '@/Components/shadcn/Form/Components';
import { DocumentUploadField } from '@/Components/shadcn/Form/DocumentUploadField';
import { UploadImageField } from '@/Components/shadcn/Form/UploadField';
import { Button } from '@/shadcn/components/ui/button';
import { Save, X } from 'lucide-react';
import { News } from '@/types';

interface FormProps {
    mode: 'create' | 'edit';
    news?: News | null;
    onClose: () => void;
}

interface NewsForm {
    title: string;
    description: string;
    image: File | null;
    preview_image?: string | null;
}

const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Maintain aspect ratio while setting max dimensions
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob with high quality
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Create new file with original name
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    0.9  // Quality setting: 0.9 = 90% quality
                );
            };

            img.onerror = (error) => {
                reject(error);
            };
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};

export default function CreateEditForm({ mode, news, onClose }: FormProps) {
    const { data, setData, post, put, processing, errors } = useForm<NewsForm>({
        title: news?.title || '',
        description: news?.description || '',
        image: null,
        preview_image: news?.image || '/assets/placeholder.png',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('admin.news.store'), {
                onSuccess: () => {
                    onClose();
                },
            });
        } else if (mode === 'edit' && news) {
            put(route('admin.news.update', news.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const handleImageChange = async (imageData: string | File) => {
        if (imageData instanceof File) {
            try {
                // Only compress if file is larger than 1MB
                if (imageData.size > 1024 * 1024) {
                    const compressedImage = await compressImage(imageData);
                    setData('image', compressedImage);
                    const previewUrl = URL.createObjectURL(compressedImage);
                    setData('preview_image', previewUrl);
                } else {
                    // Use original if small enough
                    setData('image', imageData);
                    const previewUrl = URL.createObjectURL(imageData);
                    setData('preview_image', previewUrl);
                }
            } catch (error) {
                console.error('Image compression failed:', error);
                // Fallback to original image
                setData('image', imageData);
                const previewUrl = URL.createObjectURL(imageData);
                setData('preview_image', previewUrl);
            }
        } else {
            // Handle cropped image URL
            setData('preview_image', imageData);
            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setData('image', file);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">

                {/* Right Column */}
                <div className="space-y-6">
                    <UploadImageField
                        label="News Image"
                        imagePath={data.preview_image || '/assets/placeholder.png'}
                        onImageChange={handleImageChange}
                        errorMessage={errors.image}
                    />
                </div>
                {/* Left Column */}
                <div className="space-y-6">
                    <FormField
                        label="Title"
                        value={data.title}
                        onChange={(value) => setData('title', value)}
                        errorMessage={errors.title}
                        placeholder="Enter news title"
                        required
                    />

                    <FormField
                        label="Description"
                        value={data.description}
                        onChange={(value) => setData('description', value)}
                        errorMessage={errors.description}
                        type="textarea"
                        placeholder="Enter news description"
                        required
                        className="h-32 resize-none"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    <Save className="mr-1.5 h-4 w-4" />
                    {mode === 'create' ? 'Create' : 'Update'} News
                </Button>
            </div>
        </form>
    );
}
