import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CaravanRouteDetail() {
  const params = useParams<{ slug: string }>();
  const { data: route, isLoading } = trpc.caravanRoutes.getBySlug.useQuery({ slug: params.slug || "" });
  const { data: settings } = trpc.siteSettings.list.useQuery();

  const settingsMap: Record<string, string> = {};
  settings?.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  const difficultyLabels = {
    easy: "Kolay",
    medium: "Orta",
    hard: "Zor"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-white">
        <Header settings={settingsMap} />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center py-16">
            <i className="ri-road-map-line text-6xl text-gray-300 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Rota Bulunamadı</h1>
            <p className="text-gray-500 mb-6">Aradığınız rota mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/karavan">
              <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Rotalara Dön
              </button>
            </Link>
          </div>
        </div>
        <Footer settings={settingsMap} />
      </div>
    );
  }

  const locations = route.locations as string[] | null;
  const highlights = route.highlights as string[] | null;
  const tips = route.tips as string[] | null;
  const gallery = route.gallery as string[] | null;

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settingsMap} />
      
      {/* Hero */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link href="/karavan" className="hover:text-primary">Karavan</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-gray-900 truncate">{route.name}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {route.name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {route.difficulty && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  route.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  route.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  <i className="ri-flag-line mr-1"></i>
                  {difficultyLabels[route.difficulty]}
                </span>
              )}
              {route.distance && (
                <span className="flex items-center gap-1 text-gray-600">
                  <i className="ri-map-pin-line"></i>
                  {route.distance}
                </span>
              )}
              {route.duration && (
                <span className="flex items-center gap-1 text-gray-600">
                  <i className="ri-time-line"></i>
                  {route.duration}
                </span>
              )}
            </div>

            {/* Description */}
            {route.description && (
              <p className="text-xl text-gray-600 mb-8">
                {route.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {route.featuredImage && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <img 
                src={route.featuredImage} 
                alt={route.name}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Info Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Locations */}
            {locations && locations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-map-pin-line text-primary"></i>
                  Güzergah
                </h3>
                <div className="space-y-2">
                  {locations.map((loc, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {i + 1}
                      </span>
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-star-line text-primary"></i>
                  Öne Çıkanlar
                </h3>
                <ul className="space-y-2">
                  {highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <i className="ri-check-line text-green-500 mt-0.5"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-lightbulb-line text-primary"></i>
                  İpuçları
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <i className="ri-arrow-right-s-line text-primary mt-0.5"></i>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      {route.content && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: route.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Galeri</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {gallery.map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${route.name} - ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 pt-8 border-t">
              <span className="text-gray-600 font-medium">Paylaş:</span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(route.name)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <i className="ri-twitter-x-line"></i>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(route.name + ' ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <i className="ri-whatsapp-line"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Back */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/karavan">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                <i className="ri-arrow-left-line"></i>
                Tüm Rotalara Dön
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settingsMap} />
    </div>
  );
}
