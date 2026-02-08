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

export default function AdminTeam() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    email: "",
    socialLinks: {} as Record<string, string>,
    sortOrder: 0,
    isActive: true,
  });
  const [socialLinksInput, setSocialLinksInput] = useState({
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });

  const utils = trpc.useUtils();
  const { data: members, isLoading } = trpc.teamMembers.list.useQuery();
  
  const createMutation = trpc.teamMembers.create.useMutation({
    onSuccess: () => {
      utils.teamMembers.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Ekip üyesi başarıyla oluşturuldu");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.teamMembers.update.useMutation({
    onSuccess: () => {
      utils.teamMembers.list.invalidate();
      setIsOpen(false);
      resetForm();
      toast.success("Ekip üyesi başarıyla güncellendi");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.teamMembers.delete.useMutation({
    onSuccess: () => {
      utils.teamMembers.list.invalidate();
      toast.success("Ekip üyesi başarıyla silindi");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      bio: "",
      image: "",
      email: "",
      socialLinks: {},
      sortOrder: 0,
      isActive: true,
    });
    setSocialLinksInput({
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    });
    setEditingId(null);
  };

  const handleEdit = (member: NonNullable<typeof members>[number]) => {
    const socialLinks = (member.socialLinks as Record<string, string>) || {};
    setFormData({
      name: member.name,
      title: member.title || "",
      bio: member.bio || "",
      image: member.image || "",
      email: member.email || "",
      socialLinks,
      sortOrder: member.sortOrder || 0,
      isActive: member.isActive ?? true,
    });
    setSocialLinksInput({
      instagram: socialLinks.instagram || "",
      twitter: socialLinks.twitter || "",
      youtube: socialLinks.youtube || "",
      linkedin: socialLinks.linkedin || "",
    });
    setEditingId(member.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const socialLinks: Record<string, string> = {};
    if (socialLinksInput.instagram) socialLinks.instagram = socialLinksInput.instagram;
    if (socialLinksInput.twitter) socialLinks.twitter = socialLinksInput.twitter;
    if (socialLinksInput.youtube) socialLinks.youtube = socialLinksInput.youtube;
    if (socialLinksInput.linkedin) socialLinks.linkedin = socialLinksInput.linkedin;
    
    const data = { ...formData, socialLinks };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ekip Üyeleri</h1>
            <p className="text-gray-600 mt-1">Ekip üyelerini yönetin</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Üye
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Üye Düzenle" : "Yeni Üye"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kaptan Mehmet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Ünvan</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Denizcilik Uzmanı"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Kısa biyografi..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Fotoğraf URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kaptan@viyakaptan.com"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Sosyal Medya Linkleri</Label>
                  <Input
                    value={socialLinksInput.instagram}
                    onChange={(e) => setSocialLinksInput({ ...socialLinksInput, instagram: e.target.value })}
                    placeholder="Instagram URL"
                  />
                  <Input
                    value={socialLinksInput.twitter}
                    onChange={(e) => setSocialLinksInput({ ...socialLinksInput, twitter: e.target.value })}
                    placeholder="Twitter URL"
                  />
                  <Input
                    value={socialLinksInput.youtube}
                    onChange={(e) => setSocialLinksInput({ ...socialLinksInput, youtube: e.target.value })}
                    placeholder="YouTube URL"
                  />
                  <Input
                    value={socialLinksInput.linkedin}
                    onChange={(e) => setSocialLinksInput({ ...socialLinksInput, linkedin: e.target.value })}
                    placeholder="LinkedIn URL"
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
            <CardTitle>Tüm Ekip Üyeleri</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : members?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz ekip üyesi eklenmemiş</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {members?.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Bu üyeyi silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate({ id: member.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      {member.image ? (
                        <div 
                          className="w-16 h-16 rounded-full bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${member.image})` }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl text-gray-400">{member.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        {member.title && (
                          <p className="text-sm text-gray-500">{member.title}</p>
                        )}
                        {!member.isActive && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">Pasif</span>
                        )}
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
