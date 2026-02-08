import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMockData } from "@/lib/useMockData";
import { useEffect, useState } from "react";

export default function CaravanRoutes() {
  const mockData = useMockData();
  const [useMock, setUseMock] = useState(mockData.useMock);

  const { data: routes, isLoading, error } = trpc.caravanRoutes.list.useQuery({ publishedOnly: true }, {
    enabled: !useMock,
    retry: false,
  });
  const { data: settings } = trpc.siteSettings.list.useQuery(undefined, {
    enabled: !useMock,
    retry: false,
  });

  // Switch to mock if database error
  useEffect(() => {
    if (error && !useMock) {
      console.warn('[Mock Data] Database unavailable, using mock data');
      setUseMock(true);
    }
  }, [error, useMock]);

  const settingsMap: Record<string, string> = {};
  settings?.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  // Use mock or real data
  const dataSource = useMock ? mockData.mockCaravanRoutes : routes;

  const difficultyLabels = {
    easy: "Kolay",
    medium: "Orta",
    hard: "Zor"
  };

  if (isLoading && !useMock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {useMock && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          <i className="ri-information-line mr-1"></i>
          <strong>Mock Data Modu:</strong> Database bağlantısı yok, örnek veriler gösteriliyor.
        </div>
      )}

      <Header settings={settingsMap} />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Karavan Rotaları
            </h1>
            <p className="text-lg text-gray-600">
              Türkiye'nin en güzel karavan rotalarını keşfedin, yeni maceralar planlayın
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
              Tümü
            </button>
            <button className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors">
              Kolay
            </button>
            <button className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium hover:bg-yellow-200 transition-colors">
              Orta
            </button>
            <button className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors">
              Zor
            </button>
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {dataSource?.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-road-map-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Henüz rota yayınlanmamış</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dataSource?.map((route) => (
                <Link key={route.id} href={`/karavan/${route.slug}`}>
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border">
                    {route.featuredImage && (
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={route.featuredImage}
                          alt={route.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {route.difficulty && (
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${route.difficulty === 'easy' ? 'bg-green-500 text-white' :
                              route.difficulty === 'hard' ? 'bg-red-500 text-white' :
                                'bg-yellow-500 text-white'
                            }`}>
                            {difficultyLabels[route.difficulty]}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {route.name}
                      </h2>
                      {route.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {route.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {route.distance && (
                          <span className="flex items-center gap-1">
                            <i className="ri-map-pin-line"></i>
                            {route.distance}
                          </span>
                        )}
                        {route.duration && (
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line"></i>
                            {route.duration}
                          </span>
                        )}
                      </div>
                      {(() => {
                        const locs = route.locations as string[] | null;
                        if (!locs || !Array.isArray(locs) || locs.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                            {locs.slice(0, 3).map((loc, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {loc}
                              </span>
                            ))}
                            {locs.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{locs.length - 3}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Kendi Rotanızı Paylaşın
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Keşfettiğiniz güzel rotaları bizimle paylaşın, karavan topluluğuna katkıda bulunun
          </p>
          <a
            href={`mailto:${settingsMap.contact_email || 'info@viyakaptan.com'}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <i className="ri-mail-line"></i>
            İletişime Geçin
          </a>
        </div>
      </section>

      <Footer settings={settingsMap} />
    </div>
  );
}
