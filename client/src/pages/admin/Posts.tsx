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
import { Plus, Pencil, Trash2, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminPosts() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    authorName: "",
    authorTitle: "",
    categoryId: undefined as number | undefined,
    readTime: 5,
    isPublished: false,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.posts.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({ activeOnly: true });
  
  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Yazı başarıyla oluşturuldu");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Yazı başarıyla güncellendi");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate();
      toast.success("Yazı başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      authorName: "",
      authorTitle: "",
      categoryId: undefined,
      readTime: 5,
      isPublished: false,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    });
    setEditingId(null);
  };

  const handleEdit = (post: NonNullable<typeof posts>[number]) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",
      authorName: post.authorName || "",
      authorTitle: post.authorTitle || "",
      categoryId: post.categoryId ?? undefined,
      readTime: post.readTime || 5,
      isPublished: post.isPublished ?? false,
      isFeatured: post.isFeatured ?? false,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
    });
    setEditingId(post.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      publishedAt: formData.isPublished ? new Date() : undefined,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
            <p className="text-gray-600 mt-1">Denizcilik blog yazılarını yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yazı
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Yazı Düzenle" : "Yeni Yazı"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: editingId ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                      placeholder="Yazı başlığı"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="yazi-basligi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Kategori</Label>
                    <Select
                      value={formData.categoryId?.toString() || "none"}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value === "none" ? undefined : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Kategori Yok</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Özet</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Kısa özet..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">İçerik (HTML)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Yazı içeriği (HTML destekler)..."
                    rows={10}
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="authorName">Yazar Adı</Label>
                    <Input
                      id="authorName"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="Kaptan Mehmet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorTitle">Yazar Ünvanı</Label>
                    <Input
                      id="authorTitle"
                      value={formData.authorTitle}
                      onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
                      placeholder="Denizcilik Uzmanı"
                    />
                  </div>
                  <div>
                    <Label htmlFor="readTime">Okuma Süresi (dk)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metaTitle">SEO Başlık</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO için başlık"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">SEO Açıklama</Label>
                    <Input
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO için açıklama"
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
            <CardTitle>Tüm Yazılar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz yazı eklenmemiş</div>
            ) : (
              <div className="divide-y">
                {posts?.map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      {post.featuredImage && (
                        <div 
                          className="w-16 h-12 bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${post.featuredImage})` }}
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : 'Taslak'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.viewCount || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {post.isPublished ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Yayında</span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Taslak</span>
                        )}
                        {post.isFeatured && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Öne Çıkan</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate({ id: post.id });
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
