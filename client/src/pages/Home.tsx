import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: homepageData, isLoading } = trpc.homepage.getData.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const { hero, features, posts, routes, settings } = homepageData || {};

  return (
    <div className="min-h-screen bg-white">
      <Header settings={settings} />

      {/* Hero Section */}
      {hero && (
        <section
          className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: hero.backgroundImage
              ? `url(${hero.backgroundImage})`
              : 'linear-gradient(135deg, #1e3a5f 0%, #0c1929 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Pacifico']">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                {hero.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hero.primaryButtonText && hero.primaryButtonLink && (
                <Link href={hero.primaryButtonLink}>
                  <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <i className="ri-ship-line"></i>
                    {hero.primaryButtonText}
                  </button>
                </Link>
              )}
              {hero.secondaryButtonText && hero.secondaryButtonLink && (
                <Link href={hero.secondaryButtonLink}>
                  <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                    <i className="ri-caravan-line"></i>
                    {hero.secondaryButtonText}
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <i className="ri-arrow-down-line text-white text-3xl"></i>
          </div>
        </section>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Keşfet & Öğren
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Denizcilik ve karavan dünyasına dair her şey
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  {feature.icon && (
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl mb-4 bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300`}>
                      <i className={`${feature.icon} text-2xl text-primary group-hover:text-white transition-colors`}></i>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  )}
                  {feature.link && (
                    <Link href={feature.link} className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:gap-2 transition-all">
                      Keşfet <i className="ri-arrow-right-line"></i>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      {posts && posts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Denizcilik Rehberi
                </h2>
                <p className="text-gray-600">
                  Denizcilik dünyasından en güncel içerikler
                </p>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all">
                Tümünü Gör <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <i className="ri-calendar-line"></i>
                            {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                        {post.readTime && (
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line"></i>
                            {post.readTime} dk
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary">
                Tümünü Gör <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Caravan Routes Section */}
      {routes && routes.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Karavan Rotaları
                </h2>
                <p className="text-gray-600">
                  Türkiye'nin en güzel karavan rotaları
                </p>
              </div>
              <Link href="/karavan" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all">
                Tümünü Gör <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {routes.map((route) => (
                <Link key={route.id} href={`/karavan/${route.slug}`}>
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
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
                            {route.difficulty === 'easy' ? 'Kolay' : route.difficulty === 'hard' ? 'Zor' : 'Orta'}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {route.name}
                      </h3>
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
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/karavan" className="inline-flex items-center gap-2 text-primary">
                Tümünü Gör <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Maceraya Hazır mısın?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Denizcilik ve karavan dünyasının kapılarını aralayın. Yeni rotalar keşfedin, deneyimlerinizi paylaşın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <button className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors">
                Blog'u Keşfet
              </button>
            </Link>
            <Link href="/karavan">
              <button className="px-8 py-3 bg-white/10 text-white border border-white/30 rounded-full font-medium hover:bg-white/20 transition-colors">
                Rotaları İncele
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
