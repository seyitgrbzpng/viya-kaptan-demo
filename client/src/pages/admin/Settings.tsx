import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const { data: settings, isLoading } = trpc.siteSettings.list.useQuery();
  const utils = trpc.useUtils();
  
  const [formData, setFormData] = useState({
    // Genel
    site_title: "",
    site_description: "",
    site_keywords: "",
    logo_url: "",
    favicon_url: "",
    // İletişim
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    // Sosyal Medya
    social_instagram: "",
    social_youtube: "",
    social_twitter: "",
    social_facebook: "",
    // Footer
    footer_text: "",
    footer_copyright: "",
    // SEO
    google_analytics_id: "",
    meta_author: "",
  });

  useEffect(() => {
    if (settings) {
      const newFormData = { ...formData };
      settings.forEach((setting) => {
        if (setting.key in newFormData) {
          (newFormData as Record<string, string>)[setting.key] = setting.value || "";
        }
      });
      setFormData(newFormData);
    }
  }, [settings]);

  const bulkUpsertMutation = trpc.siteSettings.bulkUpsert.useMutation({
    onSuccess: () => {
      utils.siteSettings.list.invalidate();
      toast.success("Ayarlar başarıyla kaydedildi");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSave = () => {
    const settingsToSave = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
      type: "text" as const,
      group: key.split("_")[0],
      label: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    }));
    bulkUpsertMutation.mutate(settingsToSave);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Ayarları</h1>
            <p className="text-gray-600 mt-1">Genel site ayarlarını yönetin</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={bulkUpsertMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Genel</TabsTrigger>
            <TabsTrigger value="contact">İletişim</TabsTrigger>
            <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
                <CardDescription>Site başlığı, açıklaması ve logo ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_title">Site Başlığı</Label>
                  <Input
                    id="site_title"
                    value={formData.site_title}
                    onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                    placeholder="Viya Kaptan"
                  />
                </div>
                <div>
                  <Label htmlFor="site_description">Site Açıklaması</Label>
                  <Textarea
                    id="site_description"
                    value={formData.site_description}
                    onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                    placeholder="Denizcilik ve karavan tutkunları için..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="site_keywords">Anahtar Kelimeler</Label>
                  <Input
                    id="site_keywords"
                    value={formData.site_keywords}
                    onChange={(e) => setFormData({ ...formData, site_keywords: e.target.value })}
                    placeholder="denizcilik, karavan, yelken, gezi"
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={formData.favicon_url}
                    onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>E-posta, telefon ve adres bilgileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact_email">E-posta</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="info@viyakaptan.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Telefon</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+90 555 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_address">Adres</Label>
                  <Textarea
                    id="contact_address"
                    value={formData.contact_address}
                    onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                    placeholder="İstanbul, Türkiye"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Sosyal Medya</CardTitle>
                <CardDescription>Sosyal medya hesap linkleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={formData.social_instagram}
                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/viyakaptan"
                  />
                </div>
                <div>
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={formData.social_youtube}
                    onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                    placeholder="https://youtube.com/@viyakaptan"
                  />
                </div>
                <div>
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    value={formData.social_twitter}
                    onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                    placeholder="https://twitter.com/viyakaptan"
                  />
                </div>
                <div>
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={formData.social_facebook}
                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/viyakaptan"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer Ayarları</CardTitle>
                <CardDescription>Alt bilgi metinleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="footer_text">Footer Metni</Label>
                  <Textarea
                    id="footer_text"
                    value={formData.footer_text}
                    onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                    placeholder="Denizcilik ve karavan tutkunları için..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="footer_copyright">Telif Hakkı Metni</Label>
                  <Input
                    id="footer_copyright"
                    value={formData.footer_copyright}
                    onChange={(e) => setFormData({ ...formData, footer_copyright: e.target.value })}
                    placeholder="© 2024 Viya Kaptan. Tüm hakları saklıdır."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Ayarları</CardTitle>
                <CardDescription>Arama motoru optimizasyonu ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                  <Input
                    id="google_analytics_id"
                    value={formData.google_analytics_id}
                    onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_author">Meta Author</Label>
                  <Input
                    id="meta_author"
                    value={formData.meta_author}
                    onChange={(e) => setFormData({ ...formData, meta_author: e.target.value })}
                    placeholder="Viya Kaptan"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
