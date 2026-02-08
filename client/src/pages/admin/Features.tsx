import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminFeatures() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    color: "",
    link: "",
    sortOrder: 0,
    isActive: true,
  });

  const utils = trpc.useUtils();
  const { data: features, isLoading } = trpc.featureCards.list.useQuery();
  
  const createMutation = trpc.featureCards.create.useMutation({
    onSuccess: () => {
      utils.featureCards.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Özellik kartı başarıyla oluşturuldu");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.featureCards.update.useMutation({
    onSuccess: () => {
      utils.featureCards.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Özellik kartı başarıyla güncellendi");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.featureCards.delete.useMutation({
    onSuccess: () => {
      utils.featureCards.list.invalidate();
      toast.success("Özellik kartı başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
      color: "",
      link: "",
      sortOrder: 0,
      isActive: true,
    });
    setEditingId(null);
  };

  const handleEdit = (feature: NonNullable<typeof features>[number]) => {
    setFormData({
      title: feature.title,
      description: feature.description || "",
      icon: feature.icon || "",
      color: feature.color || "",
      link: feature.link || "",
      sortOrder: feature.sortOrder || 0,
      isActive: feature.isActive ?? true,
    });
    setEditingId(feature.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Özellik Kartları</h1>
            <p className="text-gray-600 mt-1">Ana sayfa özellik kartlarını yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kart
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Kart Düzenle" : "Yeni Kart"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Yelkenli Maceraları"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Açık denizlerde yelken açmanın heyecanı..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">İkon (RemixIcon)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="ri-ship-line"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="https://remixicon.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        RemixIcon listesi
                      </a>
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="color">Renk</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">primary, secondary, cyan-500</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="link">Link (opsiyonel)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/blog"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortOrder">Sıralama</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Aktif</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingId ? "Güncelle" : "Oluştur"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tüm Özellik Kartları</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : features?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz özellik kartı eklenmemiş</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {features?.map((feature) => (
                  <div key={feature.id} className="border rounded-lg p-4 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(feature)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Bu kartı silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate({ id: feature.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {feature.icon && (
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 ${
                        feature.color ? `bg-${feature.color}/10` : 'bg-primary/10'
                      }`}>
                        <i className={`${feature.icon} text-xl ${feature.color ? `text-${feature.color}` : 'text-primary'}`}></i>
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{feature.description}</p>
                    )}
                    {!feature.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">Pasif</span>
                    )}
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
