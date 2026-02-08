import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FileText, FolderOpen, Map, FileCode } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const statCards = [
    { 
      title: "Blog Yazıları", 
      value: stats?.posts || 0, 
      icon: FileText, 
      color: "bg-blue-500",
      link: "/admin/posts"
    },
    { 
      title: "Karavan Rotaları", 
      value: stats?.routes || 0, 
      icon: Map, 
      color: "bg-green-500",
      link: "/admin/routes"
    },
    { 
      title: "Kategoriler", 
      value: stats?.categories || 0, 
      icon: FolderOpen, 
      color: "bg-purple-500",
      link: "/admin/categories"
    },
    { 
      title: "Sayfalar", 
      value: stats?.pages || 0, 
      icon: FileCode, 
      color: "bg-orange-500",
      link: "/admin/pages"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Viya Kaptan yönetim paneline hoş geldiniz</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {isLoading ? "..." : stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/posts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">Yeni Blog Yazısı Ekle</span>
              </Link>
              <Link href="/admin/routes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <Map className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Yeni Karavan Rotası Ekle</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <FolderOpen className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700">Site Ayarlarını Düzenle</span>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Bilgisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Versiyon</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Son Güncelleme</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Durum</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Aktif
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
