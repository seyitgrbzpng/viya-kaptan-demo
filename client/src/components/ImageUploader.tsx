import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    id?: string;
}

export default function ImageUploader({
    label,
    value,
    onChange,
    placeholder = "https://...",
    id = "image-upload",
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = trpc.media.upload.useMutation({
        onSuccess: (data) => {
            onChange(data.url);
            toast.success("Görsel başarıyla yüklendi");
        },
        onError: (error) => {
            toast.error("Yükleme başarısız: " + error.message);
        },
        onSettled: () => setUploading(false),
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen bir görsel dosyası seçin");
            return;
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Dosya boyutu 10MB'dan küçük olmalıdır");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            uploadMutation.mutate({
                filename: file.name,
                base64,
                mimeType: file.type,
            });
        };
        reader.readAsDataURL(file);

        // Reset file input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            {/* URL Input + Upload Button */}
            <div className="flex gap-2">
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                    disabled={uploading}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Görsel yükle"
                >
                    {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="h-4 w-4" />
                    )}
                </Button>
                {value && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClear}
                        title="Görseli kaldır"
                        className="text-red-500 hover:text-red-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Preview */}
            {uploading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yükleniyor...
                </div>
            )}

            {value && !uploading && (
                <div className="relative mt-2 group inline-block">
                    <img
                        src={value}
                        alt="Ön izleme"
                        className="max-h-32 max-w-full rounded-lg border border-gray-200 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                        onLoad={(e) => {
                            (e.target as HTMLImageElement).style.display = "block";
                        }}
                    />
                </div>
            )}

            {!value && !uploading && (
                <div
                    className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <span className="text-xs">Görsel seçmek için tıklayın</span>
                    </div>
                </div>
            )}
        </div>
    );
}
