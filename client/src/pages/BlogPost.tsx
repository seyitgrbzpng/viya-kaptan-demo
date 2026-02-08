import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery({ slug: params.slug || "" });
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

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header settings={settingsMap} />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center py-16">
            <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Yazı Bulunamadı</h1>
            <p className="text-gray-500 mb-6">Aradığınız yazı mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/blog">
              <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Blog'a Dön
              </button>
            </Link>
          </div>
        </div>
        <Footer settings={settingsMap} />
      </div>
    );
  }

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
              <Link href="/blog" className="hover:text-primary">Denizcilik</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-gray-900 truncate">{post.title}</span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <i className="ri-calendar-line"></i>
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <i className="ri-time-line"></i>
                  {post.readTime} dakika okuma
                </span>
              )}
              {(post.viewCount ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <i className="ri-eye-line"></i>
                  {post.viewCount} görüntülenme
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8">
                {post.excerpt}
              </p>
            )}

            {/* Author */}
            {post.authorName && (
              <div className="flex items-center gap-4 pb-8 border-b">
                {post.authorImage ? (
                  <img 
                    src={post.authorImage} 
                    alt={post.authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-lg font-medium">
                      {post.authorName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{post.authorName}</p>
                  {post.authorTitle && (
                    <p className="text-sm text-gray-500">{post.authorTitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 pt-8 border-t">
              <span className="text-gray-600 font-medium">Paylaş:</span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
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
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
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

      {/* Back to Blog */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/blog">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                <i className="ri-arrow-left-line"></i>
                Tüm Yazılara Dön
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settingsMap} />
    </div>
  );
}
