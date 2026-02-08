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

export default function AdminHero() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    backgroundImage: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    isActive: true,
    sortOrder: 0,
  });

  const utils = trpc.useUtils();
  const { data: heroSections, isLoading } = trpc.heroSections.list.useQuery();
  
  const createMutation = trpc.heroSections.create.useMutation({
    onSuccess: () => {
      utils.heroSections.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Hero bölümü başarıyla oluşturuldu");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.heroSections.update.useMutation({
    onSuccess: () => {
      utils.heroSections.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Hero bölümü başarıyla güncellendi");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.heroSections.delete.useMutation({
    onSuccess: () => {
      utils.heroSections.list.invalidate();
      toast.success("Hero bölümü başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      backgroundImage: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (hero: NonNullable<typeof heroSections>[number]) => {
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle || "",
      backgroundImage: hero.backgroundImage || "",
      primaryButtonText: hero.primaryButtonText || "",
      primaryButtonLink: hero.primaryButtonLink || "",
      secondaryButtonText: hero.secondaryButtonText || "",
      secondaryButtonLink: hero.secondaryButtonLink || "",
      isActive: hero.isActive ?? true,
      sortOrder: hero.sortOrder || 0,
    });
    setEditingId(hero.id);
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
            <h1 className="text-3xl font-bold text-gray-900">Hero Bölümü</h1>
            <p className="text-gray-600 mt-1">Ana sayfa hero bölümünü yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Hero
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Hero Düzenle" : "Yeni Hero"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Denizlerin Büyüsünü Keşfet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Alt Başlık</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Yelkenlerle açık denizlerde özgürlüğü yaşayın..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="backgroundImage">Arka Plan Görsel URL</Label>
                  <Input
                    id="backgroundImage"
                    value={formData.backgroundImage}
                    onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryButtonText">Birincil Buton Metni</Label>
                    <Input
                      id="primaryButtonText"
                      value={formData.primaryButtonText}
                      onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                      placeholder="Denizcilik Rehberi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryButtonLink">Birincil Buton Linki</Label>
                    <Input
                      id="primaryButtonLink"
                      value={formData.primaryButtonLink}
                      onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                      placeholder="/blog"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondaryButtonText">İkincil Buton Metni</Label>
                    <Input
                      id="secondaryButtonText"
                      value={formData.secondaryButtonText}
                      onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                      placeholder="Karavan Rehberi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryButtonLink">İkincil Buton Linki</Label>
                    <Input
                      id="secondaryButtonLink"
                      value={formData.secondaryButtonLink}
                      onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                      placeholder="/karavan"
                    />
                  </div>
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
            <CardTitle>Hero Bölümleri</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : heroSections?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz hero bölümü eklenmemiş</div>
            ) : (
              <div className="space-y-4">
                {heroSections?.map((hero) => (
                  <div key={hero.id} className="border rounded-lg overflow-hidden">
                    <div className="flex">
                      {hero.backgroundImage && (
                        <div 
                          className="w-48 h-32 bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
                        />
                      )}
                      <div className="flex-1 p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{hero.title}</h3>
                          {hero.subtitle && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{hero.subtitle}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {hero.isActive ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Aktif</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Pasif</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(hero)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm("Bu hero bölümünü silmek istediğinize emin misiniz?")) {
                                deleteMutation.mutate({ id: hero.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
