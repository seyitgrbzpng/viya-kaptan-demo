import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMockData } from "@/lib/useMockData";
import { useEffect, useState } from "react";

export default function BlogList() {
  const mockData = useMockData();
  const [useMock, setUseMock] = useState(mockData.useMock);

  const { data: posts, isLoading, error } = trpc.posts.list.useQuery({ publishedOnly: true }, {
    enabled: !useMock,
    retry: false,
  });
  const { data: categories } = trpc.categories.list.useQuery({ activeOnly: true }, {
    enabled: !useMock,
    retry: false,
  });
  const { data: settings } = trpc.siteSettings.list.useQuery(undefined, {
    enabled: !useMock,
    retry: false,
  });

  // Switch to mock if database error
  useEffect(() => {
    if ((error) && !useMock) {
      console.warn('[Mock Data] Database unavailable, using mock data');
      setUseMock(true);
    }
  }, [error, useMock]);

  const settingsMap: Record<string, string> = {};
  settings?.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  // Use mock or real data
  const dataSource = useMock ? {
    posts: mockData.mockPosts,
    categories: mockData.mockCategories,
  } : { posts, categories };

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
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Denizcilik Rehberi
            </h1>
            <p className="text-lg text-gray-600">
              Denizcilik dünyasından en güncel bilgiler, ipuçları ve maceralar
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      {dataSource.categories && dataSource.categories.length > 0 && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
                Tümü
              </button>
              {dataSource.categories.map((cat) => (
                <button
                  key={cat.id}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {dataSource.posts?.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Henüz yazı yayınlanmamış</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dataSource.posts?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border">
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
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      {post.authorName && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {post.authorName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                            {post.authorTitle && (
                              <p className="text-xs text-gray-500">{post.authorTitle}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settingsMap} />
    </div>
  );
}
