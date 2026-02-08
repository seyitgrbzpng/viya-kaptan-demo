import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminRoutes() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    content: "",
    featuredImage: "",
    distance: "",
    duration: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    locations: [] as string[],
    highlights: [] as string[],
    tips: [] as string[],
    isPublished: false,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [locationsInput, setLocationsInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [tipsInput, setTipsInput] = useState("");

  const utils = trpc.useUtils();
  const { data: routes, isLoading } = trpc.caravanRoutes.list.useQuery();
  
  const createMutation = trpc.caravanRoutes.create.useMutation({
    onSuccess: () => {
      utils.caravanRoutes.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Rota başarıyla oluşturuldu");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.caravanRoutes.update.useMutation({
    onSuccess: () => {
      utils.caravanRoutes.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Rota başarıyla güncellendi");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.caravanRoutes.delete.useMutation({
    onSuccess: () => {
      utils.caravanRoutes.list.invalidate();
      toast.success("Rota başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      content: "",
      featuredImage: "",
      distance: "",
      duration: "",
      difficulty: "medium",
      locations: [],
      highlights: [],
      tips: [],
      isPublished: false,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    });
    setLocationsInput("");
    setHighlightsInput("");
    setTipsInput("");
    setEditingId(null);
  };

  const handleEdit = (route: NonNullable<typeof routes>[number]) => {
    const locations = Array.isArray(route.locations) ? route.locations as string[] : [];
    const highlights = Array.isArray(route.highlights) ? route.highlights as string[] : [];
    const tips = Array.isArray(route.tips) ? route.tips as string[] : [];
    
    setFormData({
      name: route.name,
      slug: route.slug,
      description: route.description || "",
      content: route.content || "",
      featuredImage: route.featuredImage || "",
      distance: route.distance || "",
      duration: route.duration || "",
      difficulty: route.difficulty || "medium",
      locations,
      highlights,
      tips,
      isPublished: route.isPublished ?? false,
      isFeatured: route.isFeatured ?? false,
      metaTitle: route.metaTitle || "",
      metaDescription: route.metaDescription || "",
    });
    setLocationsInput(locations.join(", "));
    setHighlightsInput(highlights.join("\n"));
    setTipsInput(tips.join("\n"));
    setEditingId(route.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      locations: locationsInput.split(",").map(s => s.trim()).filter(Boolean),
      highlights: highlightsInput.split("\n").map(s => s.trim()).filter(Boolean),
      tips: tipsInput.split("\n").map(s => s.trim()).filter(Boolean),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const difficultyLabels = {
    easy: "Kolay",
    medium: "Orta",
    hard: "Zor"
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Karavan Rotaları</h1>
            <p className="text-gray-600 mt-1">Karavan rotalarını yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Rota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Rota Düzenle" : "Yeni Rota"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Rota Adı</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          name: e.target.value,
                          slug: editingId ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                      placeholder="Örn: Ege Kıyıları Rotası"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="ege-kiyilari-rotasi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Zorluk</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Kolay</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="hard">Zor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distance">Mesafe</Label>
                    <Input
                      id="distance"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      placeholder="450 km"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Süre</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="7 gün"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Kısa Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Rota hakkında kısa açıklama..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Detaylı İçerik (HTML)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Rota detayları (HTML destekler)..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="featuredImage">Öne Çıkan Görsel URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="locations">Konumlar (virgülle ayırın)</Label>
                  <Input
                    id="locations"
                    value={locationsInput}
                    onChange={(e) => setLocationsInput(e.target.value)}
                    placeholder="Çeşme, Foça, Dikili, Ayvalık, Bodrum"
                  />
                </div>

                <div>
                  <Label htmlFor="highlights">Öne Çıkan Özellikler (her satıra bir tane)</Label>
                  <Textarea
                    id="highlights"
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="Muhteşem koy manzaraları&#10;Tarihi antik şehirler&#10;Yerel lezzetler"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="tips">İpuçları (her satıra bir tane)</Label>
                  <Textarea
                    id="tips"
                    value={tipsInput}
                    onChange={(e) => setTipsInput(e.target.value)}
                    placeholder="Erken rezervasyon yapın&#10;Su deposunu doldurun&#10;Haritayı indirin"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metaTitle">SEO Başlık</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">SEO Açıklama</Label>
                    <Input
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    />
                    <Label htmlFor="isPublished">Yayınla</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Öne Çıkar</Label>
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
            <CardTitle>Tüm Rotalar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : routes?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz rota eklenmemiş</div>
            ) : (
              <div className="divide-y">
                {routes?.map((route) => (
                  <div key={route.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      {route.featuredImage && (
                        <div 
                          className="w-20 h-14 bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${route.featuredImage})` }}
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{route.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {route.distance && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {route.distance}
                            </span>
                          )}
                          {route.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {route.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {route.isPublished ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Yayında</span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Taslak</span>
                        )}
                        {route.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            route.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            route.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {difficultyLabels[route.difficulty]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(route)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Bu rotayı silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate({ id: route.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
