// Mock data for testing without database
// Uses picsum.photos for placeholder images

export const mockCategories = [
    {
        id: 1,
        name: "Denizcilik",
        slug: "denizcilik",
        description: "Denizcilik, tekneler ve marina hakkında her şey",
        icon: "ri-ship-line",
        color: "blue",
        sortOrder: 1,
        isActive: true,
    },
    {
        id: 2,
        name: "Karavan",
        slug: "karavan",
        description: "Karavan rotaları, kamplar ve seyahat rehberi",
        icon: "ri-truck-line",
        color: "green",
        sortOrder: 2,
        isActive: true,
    },
    {
        id: 3,
        name: "Tekne Bakımı",
        slug: "tekne-bakimi",
        description: "Tekne bakım ve onarım ipuçları",
        icon: "ri-tools-line",
        color: "orange",
        sortOrder: 3,
        isActive: true,
    },
];

export const mockPosts = [
    {
        id: 1,
        title: "Tekne Bakımı: İlkbahar Hazırlığı",
        slug: "tekne-bakimi-ilkbahar-hazirligi",
        excerpt: "Teknenizi ilkbahar sezonuna hazırlamanız için kapsamlı rehber. Motor bakımından boya işlemlerine kadar her şey.",
        content: `
      <h2>İlkbahar Hazırlığına Neden İhtiyaç Var?</h2>
      <p>Kış ayları boyunca kullanılmayan tekneler, ilkbahar sezonuna hazırlanmadan önce kapsamlı bir bakıma ihtiyaç duyar. Bu rehberde, teknenizi sezona hazırlamanız için gereken tüm adımları bulabilirsiniz.</p>
      
      <h3>1. Motor Kontrolü</h3>
      <p>Motor yağı ve filtrelerin değişimi kritik önem taşır. Ayrıca yakıt sisteminin temizliğini kontrol edin.</p>
      
      <h3>2. Gövde Bakımı</h3>
      <p>Tekne gövdesini barnakıllardan temizleyin ve gerekirse boya yenileyin. Alt tarafın temizliği yakıt verimliliğini artırır.</p>
      
      <h3>3. Elektrik Sistemi</h3>
      <p>Aküleri şarj edin ve kabloların durumunu kontrol edin. Işıklar ve navigasyon sistemlerini test edin.</p>
    `,
        featuredImage: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop",
        authorName: "Ahmet Yılmaz",
        authorTitle: "Denizci & Tekne Uzmanı",
        authorImage: "https://i.pravatar.cc/150?img=12",
        categoryId: 1,
        readTime: 8,
        viewCount: 1245,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date("2024-03-15"),
    },
    {
        id: 2,
        title: "Akdeniz Kıyıları Karavan Rotası",
        slug: "akdeniz-kiyilari-karavan-rotasi",
        excerpt: "Antalya'dan Muğla'ya uzanan muhteşem bir karavan yolculuğu rotası. 7 günlük macera sizi bekliyor!",
        content: `
      <h2>Akdeniz'in En Güzel Kıyıları</h2>
      <p>Bu rota, Türkiye'nin en güzel kıyı şeridini keşfetmek isteyenler için mükemmel bir seçenek.</p>
      
      <h3>Güzergah Özeti</h3>
      <ul>
        <li>1. Gün: Antalya - Kaş (190 km)</li>
        <li>2. Gün: Kaş - Fethiye (110 km)</li>
        <li>3. Gün: Fethiye - Dalyan (80 km)</li>
        <li>3. Gün: Dalyan - Marmaris (90 km)</li>
        <li>4. Gün: Dalyan - Marmaris (90 km)</li>
      </ul>
      
      <h3>Önerilen Konaklama Noktaları</h3>
      <p>Her durakta karavan için uygun kamp alanlarını detaylı olarak anlattık.</p>
    `,
        featuredImage: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
        authorName: "Zeynep Demir",
        authorTitle: "Seyahat Yazarı",
        authorImage: "https://i.pravatar.cc/150?img=45",
        categoryId: 2,
        readTime: 12,
        viewCount: 2341,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date("2024-03-10"),
    },
    {
        id: 3,
        title: "Marina Seçimi Rehberi",
        slug: "marina-secimi-rehberi",
        excerpt: "Doğru marinayı seçmek için dikkat etmeniz gereken kriterler ve Türkiye'nin en iyi marinaları.",
        content: `
      <h2>Marina Seçerken Nelere Dikkat Edilmeli?</h2>
      <p>Tekneniz için uygun marinanı seçmek, konfor ve güvenlik açısından kritik önem taşır.</p>
      
      <h3>Temel Kriterler</h3>
      <ol>
        <li>Konum ve erişilebilirlik</li>
        <li>Güvenlik önlemleri</li>
        <li>Hizmet kalitesi</li>
        <li>Fiyat/performans dengesi</li>
      </ol>
    `,
        featuredImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        authorName: "Can Öztürk",
        authorTitle: "Marina Danışmanı",
        authorImage: "https://i.pravatar.cc/150?img=33",
        categoryId: 1,
        readTime: 6,
        viewCount: 856,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date("2024-03-08"),
    },
];

export const mockCaravanRoutes = [
    {
        id: 1,
        name: "Karadeniz Sahil Rotası",
        slug: "karadeniz-sahil-rotasi",
        description: "Karadeniz'in eşsiz doğasını keşfedin",
        content: `
      <h2>Karadeniz'in Büyüsü</h2>
      <p>Yeşilin her tonunu görebileceğiniz, doğa ile iç içe bir karavan yolculuğu.</p>
    `,
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        distance: "850 km",
        duration: "10 gün",
        difficulty: "medium",
        locations: ["Trabzon", "Rize", "Artvin", "Hopa"],
        highlights: [
            "Uzungöl doğal güzelliği",
            "Çay bahçeleri turu",
            "Tarihi köprüler",
            "Yerel mutfak deneyimi"
        ],
        tips: [
            "Yağmurlu hava için hazırlıklı olun",
            "Yokuşlar için fren sistemini kontrol edin",
            "Yerel rehber tutmanız önerilir"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
        ],
        isPublished: true,
        isFeatured: true,
    },
    {
        id: 2,
        name: "Kapadokya Çevresi",
        slug: "kapadokya-cevresi",
        description: "Peri bacaları ve tarihi dokuyla dolu bir macera",
        content: `
      <h2>Kapadokya'da Karavan</h2>
      <p>Türkiye'nin en ikonik destinasyonlarından biri olan Kapadokya, karavan ile keşfetmek için ideal.</p>
    `,
        featuredImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
        distance: "320 km",
        duration: "5 gün",
        difficulty: "easy",
        locations: ["Nevşehir", "Ürgüp", "Avanos", "Göreme"],
        highlights: [
            "Peri bacaları",
            "Yeraltı şehirleri",
            "Sıcak hava balonu turu",
            "Çömlek atölyeleri"
        ],
        tips: [
            "Sabah erkenden kalktığınızda balon turlarını görün",
            "Kamp alanları önceden rezervasyon yapın",
            "Güneş kremi unutmayın"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=400&h=300&fit=crop",
        ],
        isPublished: true,
        isFeatured: true,
    },
];

export const mockHeroSection = {
    id: 1,
    title: "Viya Kaptan'a Hoş Geldiniz",
    subtitle: "Denizcilik ve karavan tutkunları için kapsamlı rehber platformu",
    backgroundImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop",
    primaryButtonText: "Rotaları Keşfet",
    primaryButtonLink: "/karavan",
    secondaryButtonText: "Blog'u İncele",
    secondaryButtonLink: "/blog",
    isActive: true,
    sortOrder: 1,
};

export const mockFeatureCards = [
    {
        id: 1,
        title: "Karavan Rotaları",
        description: "Türkiye'nin dört bir yanındaki en güzel karavan rotalarını keşfedin",
        icon: "ri-road-map-line",
        color: "blue",
        link: "/karavan",
        sortOrder: 1,
        isActive: true,
    },
    {
        id: 2,
        title: "Denizcilik Rehberi",
        description: "Tekne bakımından marina seçimine kadar her şey",
        icon: "ri-ship-2-line",
        color: "teal",
        link: "/blog?category=denizcilik",
        sortOrder: 2,
        isActive: true,
    },
    {
        id: 3,
        title: "Uzman Tavsiyeleri",
        description: "Alanında uzman yazarlardan ipuçları ve öneriler",
        icon: "ri-lightbulb-line",
        color: "orange",
        link: "/blog",
        sortOrder: 3,
        isActive: true,
    },
    {
        id: 4,
        title: "Topluluk",
        description: "Deneyimlerinizi paylaşın, diğer tutkunlarla tanışın",
        icon: "ri-team-line",
        color: "purple",
        link: "#",
        sortOrder: 4,
        isActive: true,
    },
];

export const mockTeamMembers = [
    {
        id: 1,
        name: "Mehmet Kaptan",
        title: "Kurucu & Baş Editör",
        bio: "20 yıllık denizcilik deneyimi",
        image: "https://i.pravatar.cc/300?img=15",
        email: "mehmet@viyakaptan.com",
        socialLinks: {
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
        sortOrder: 1,
        isActive: true,
    },
    {
        id: 2,
        name: "Ayşe Yılmaz",
        title: "Karavan Rotaları Editörü",
        bio: "Türkiye'nin her köşesini karavan ile gezdi",
        image: "https://i.pravatar.cc/300?img=47",
        email: "ayse@viyakaptan.com",
        socialLinks: {
            instagram: "https://instagram.com",
        },
        sortOrder: 2,
        isActive: true,
    },
];
