import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function AdminMedia() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: media, isLoading } = trpc.media.list.useQuery();
  
  const uploadMutation = trpc.media.upload.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      setIsOpen(false);
      setAlt("");
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Dosya başarıyla yüklendi");
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setUploading(false),
  });

  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      toast.success("Dosya başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan küçük olmalıdır");
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      uploadMutation.mutate({
        filename: file.name,
        base64,
        mimeType: file.type,
        alt,
        caption,
      });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL kopyalandı");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medya</h1>
            <p className="text-gray-600 mt-1">Görselleri ve dosyaları yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Dosya Yükle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Dosya Yükle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Dosya Seç</Label>
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Maksimum 10MB</p>
                </div>
                <div>
                  <Label htmlFor="alt">Alt Metin (SEO)</Label>
                  <Input
                    id="alt"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Görsel açıklaması"
                  />
                </div>
                <div>
                  <Label htmlFor="caption">Açıklama</Label>
                  <Input
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Görsel başlığı"
                  />
                </div>
                {uploading && (
                  <div className="text-center py-4 text-gray-500">
                    Yükleniyor...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tüm Dosyalar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : media?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz dosya yüklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {media?.map((item) => (
                  <div key={item.id} className="group relative">
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${item.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:text-white hover:bg-white/20"
                        onClick={() => copyToClipboard(item.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-white/20"
                        onClick={() => {
                          if (confirm("Bu dosyayı silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.originalName}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
