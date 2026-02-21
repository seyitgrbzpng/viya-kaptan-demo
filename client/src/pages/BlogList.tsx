import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogList() {
  const { data: posts, isLoading } = trpc.posts.list.useQuery({ publishedOnly: true });
  const { data: categories } = trpc.categories.list.useQuery({ activeOnly: true });
  const { data: settings } = trpc.siteSettings.list.useQuery();

  const settingsMap: Record<string, string> = {};
  settings?.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
      {categories && categories.length > 0 && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
                Tümü
              </button>
              {categories.map((cat) => (
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
          {posts?.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Henüz yazı yayınlanmamış</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post) => (
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
