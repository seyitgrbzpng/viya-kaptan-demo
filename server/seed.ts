/**
 * Seed script: İçerikleri veritabanına ve fotoğrafları Cloudinary'e yükler.
 * Çalıştırma: npx tsx server/seed.ts
 */
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { sql } from "drizzle-orm";

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
async function getDb() {
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    return drizzle(pool, { schema, mode: "default" });
}

// Upload image from URL to Cloudinary
async function uploadToCloudinary(
    imageUrl: string,
    folder: string,
    publicId: string
): Promise<string> {
    try {
        console.log(`  ⬆️  Uploading ${publicId}...`);
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: `viya-kaptan/${folder}`,
            public_id: publicId,
            overwrite: true,
            resource_type: "image",
        });
        console.log(`  ✅ Uploaded: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`  ❌ Upload failed for ${publicId}:`, error);
        return imageUrl; // Fallback to original URL
    }
}

// ==================== SEED DATA ====================

async function seedCategories(db: any) {
    console.log("\n📁 Kategoriler ekleniyor...");

    const categoriesData = [
        {
            name: "Yelken",
            slug: "yelken",
            description: "Yelken sporu, tekne bakımı ve denizcilik bilgileri",
            icon: "ri-sailboat-line",
            color: "bg-blue-500",
            sortOrder: 1,
            isActive: true,
        },
        {
            name: "Navigasyon",
            slug: "navigasyon",
            description: "Deniz navigasyonu, harita okuma ve GPS kullanımı",
            icon: "ri-compass-3-line",
            color: "bg-teal-500",
            sortOrder: 2,
            isActive: true,
        },
        {
            name: "Karavan Yaşam",
            slug: "karavan-yasam",
            description: "Karavan hayatı, gezi notları ve ipuçları",
            icon: "ri-caravan-line",
            color: "bg-green-500",
            sortOrder: 3,
            isActive: true,
        },
        {
            name: "Deniz Güvenliği",
            slug: "deniz-guvenligi",
            description: "Denizde güvenlik kuralları ve acil durum prosedürleri",
            icon: "ri-lifebuoy-line",
            color: "bg-red-500",
            sortOrder: 4,
            isActive: true,
        },
    ];

    for (const cat of categoriesData) {
        await db.insert(schema.categories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
    }
    console.log(`  ✅ ${categoriesData.length} kategori eklendi`);

    // Return categories for reference
    return db.select().from(schema.categories);
}

async function seedHeroSection(db: any) {
    console.log("\n🎯 Hero bölümü ekleniyor...");

    const heroImage = await uploadToCloudinary(
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
        "hero",
        "hero-main"
    );

    await db.insert(schema.heroSections).values({
        title: "Denizin Özgürlüğü, Yolun Keşfi",
        subtitle: "Yelkenli ile mavi sularda, karavanla yeşil yollarda. Türkiye'nin en güzel rotalarını keşfedin.",
        backgroundImage: heroImage,
        primaryButtonText: "Rotaları Keşfet",
        primaryButtonLink: "/karavan",
        secondaryButtonText: "Blog Yazıları",
        secondaryButtonLink: "/blog",
        isActive: true,
        sortOrder: 1,
    }).onDuplicateKeyUpdate({ set: { title: "Denizin Özgürlüğü, Yolun Keşfi" } });

    console.log("  ✅ Hero bölümü eklendi");
}

async function seedFeatureCards(db: any) {
    console.log("\n✨ Özellik kartları ekleniyor...");

    const features = [
        {
            title: "Yelken Eğitimi",
            description: "Başlangıçtan ileri seviyeye yelken eğitimi rehberleri ve deneyimlerimiz.",
            icon: "ri-sailboat-line",
            color: "bg-blue-500",
            link: "/blog",
            sortOrder: 1,
            isActive: true,
        },
        {
            title: "Karavan Rotaları",
            description: "Türkiye'nin dört bir yanından özenle seçilmiş karavan rotaları.",
            icon: "ri-road-map-line",
            color: "bg-green-500",
            link: "/karavan",
            sortOrder: 2,
            isActive: true,
        },
        {
            title: "Gezi Rehberi",
            description: "Deniz ve kara maceralarınız için detaylı gezi rehberleri.",
            icon: "ri-map-pin-line",
            color: "bg-amber-500",
            link: "/blog",
            sortOrder: 3,
            isActive: true,
        },
        {
            title: "Güvenlik İpuçları",
            description: "Denizde ve karada güvenliğiniz için önemli bilgiler ve tavsiyeler.",
            icon: "ri-shield-check-line",
            color: "bg-red-500",
            link: "/blog",
            sortOrder: 4,
            isActive: true,
        },
    ];

    for (const feature of features) {
        await db.insert(schema.featureCards).values(feature).onDuplicateKeyUpdate({ set: { title: feature.title } });
    }
    console.log(`  ✅ ${features.length} özellik kartı eklendi`);
}

async function seedPosts(db: any, categories: any[]) {
    console.log("\n📝 Blog yazıları ekleniyor...");

    // Find category IDs
    const yelkenCat = categories.find((c: any) => c.slug === "yelken");
    const navigasyonCat = categories.find((c: any) => c.slug === "navigasyon");
    const karavanCat = categories.find((c: any) => c.slug === "karavan-yasam");
    const guvenlikCat = categories.find((c: any) => c.slug === "deniz-guvenligi");

    // Upload images
    const [img1, img2, img3, img4] = await Promise.all([
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
            "posts",
            "post-yelken-baslangic"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80",
            "posts",
            "post-navigasyon"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
            "posts",
            "post-karavan-kamping"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            "posts",
            "post-deniz-guvenligi"
        ),
    ]);

    const postsData = [
        {
            title: "Yelkencilik: Başlangıç Rehberi",
            slug: "yelkencilik-baslangic-rehberi",
            excerpt: "Yelken sporuna yeni başlayanlar için kapsamlı bir rehber. Temel kavramlar, gerekli ekipmanlar ve ilk yelken deneyiminiz için ipuçları.",
            content: `<h2>Yelkene Başlamak</h2>
<p>Yelken sporu, doğayla iç içe olmanın en güzel yollarından biridir. Rüzgârın gücüyle ilerlemek, denizin sonsuz maviliğinde kaybolmak herkesin hayalini süsler.</p>

<h3>Temel Ekipmanlar</h3>
<ul>
<li><strong>Can yeleği:</strong> Her zaman giyin, güvenliğiniz her şeyden önemli</li>
<li><strong>Güneş kremi:</strong> Denizde güneş daha güçlü yansır</li>
<li><strong>Eldiven:</strong> Halat çalışmaları için gerekli</li>
<li><strong>Yelken ayakkabısı:</strong> Kaymayan tabanlı</li>
</ul>

<h3>İlk Deneyim</h3>
<p>İlk yelken deneyiminiz için mutlaka deneyimli bir kaptanla çıkın. Rüzgâr yönünü, yelken açılarını ve temel dümen kullanımını öğrenin.</p>

<h3>Rüzgâr Bilgisi</h3>
<p>Yelkencilik rüzgâr okumayı öğrenmekle başlar. Beaufort skalasını öğrenin, rüzgâr yönünü ve hızını tahmin etmeyi pratik yaparak geliştirin.</p>`,
            featuredImage: img1,
            authorName: "Kaptan Mehmet",
            authorTitle: "Denizcilik Eğitmeni",
            categoryId: yelkenCat?.id || 1,
            readTime: 8,
            viewCount: 245,
            isPublished: true,
            isFeatured: true,
            metaTitle: "Yelkencilik Başlangıç Rehberi - Viya Kaptan",
            metaDescription: "Yelken sporuna yeni başlayanlar için temel bilgiler ve ekipman rehberi.",
            publishedAt: new Date("2025-12-15"),
        },
        {
            title: "Deniz Navigasyonu: Harita Okuma ve GPS Kullanımı",
            slug: "deniz-navigasyonu-harita-okuma",
            excerpt: "Modern deniz navigasyonu hakkında bilmeniz gereken her şey. Geleneksel harita okumadan GPS teknolojisine kadar.",
            content: `<h2>Deniz Navigasyonunun Temelleri</h2>
<p>Denizde güvenli bir şekilde yol almak, doğru navigasyon bilgisine sahip olmakla başlar. Teknoloji ne kadar gelişirse gelişsin, temel navigasyon becerileri her denizci için vazgeçilmezdir.</p>

<h3>Deniz Haritası Okuma</h3>
<p>Deniz haritaları, karadaki haritalardan çok farklıdır. Derinlik çizgileri, sığlık uyarıları, akıntı bilgileri ve liman giriş noktaları haritada özel sembollerle gösterilir.</p>

<h3>GPS ve Plotter Kullanımı</h3>
<p>Modern GPS cihazları denizde navigasyonu kolaylaştırsa da, her zaman geleneksel yöntemleri de bilmelisiniz. Pil bitmesi veya cihaz arızası her zaman mümkündür.</p>

<h3>Pusula ve Yıldız Navigasyonu</h3>
<p>Geleneksel denizcilik becerileri arasında pusula kullanımı ve yıldızlara bakarak yön tayini önemli bir yer tutar. Kuzey Yıldızı (Polaris) her denizcinin en sadık arkadaşıdır.</p>`,
            featuredImage: img2,
            authorName: "Kaptan Ali",
            authorTitle: "Navigasyon Uzmanı",
            categoryId: navigasyonCat?.id || 2,
            readTime: 12,
            viewCount: 189,
            isPublished: true,
            isFeatured: true,
            metaTitle: "Deniz Navigasyonu Rehberi - Viya Kaptan",
            metaDescription: "Harita okuma, GPS kullanımı ve deniz navigasyonunun temelleri.",
            publishedAt: new Date("2025-11-20"),
        },
        {
            title: "Karavan ile Türkiye Turu: En İyi Kamp Alanları",
            slug: "karavan-turkiye-turu-kamp-alanlari",
            excerpt: "Türkiye'nin en güzel karavan kamp alanlarını keşfedin. Ege'den Karadeniz'e, Akdeniz'den İç Anadolu'ya uzanan rotalar.",
            content: `<h2>Karavan ile Türkiye</h2>
<p>Türkiye, karavancılar için cennet gibi bir ülke. Dört mevsimi yaşayabileceğiniz rotalar, muhteşem doğal güzellikler ve misafirperver insanlar sizi bekliyor.</p>

<h3>Ege Sahilleri</h3>
<p>Ege kıyılarında irili ufaklı onlarca kamp alanı bulunuyor. Özellikle Çeşme, Bodrum ve Fethiye çevresi karavancılar için ideal noktalar.</p>

<h3>Karadeniz Yaylaları</h3>
<p>Yaz sıcağından bunaldıysanız Karadeniz yaylaları tam size göre. Ayder, Pokut, Sal gibi yaylalarda doğayla iç içe bir karavan deneyimi yaşayabilirsiniz.</p>

<h3>Kamp Alanı Seçimi İpuçları</h3>
<ul>
<li>Elektrik ve su bağlantısını kontrol edin</li>
<li>Tuvalet ve duş imkânlarını sorun</li>
<li>Güvenlik durumunu araştırın</li>
<li>Çevredeki market ve sağlık kuruluşlarına uzaklığı bilin</li>
</ul>`,
            featuredImage: img3,
            authorName: "Ayşe Yılmaz",
            authorTitle: "Karavan Gezgini",
            categoryId: karavanCat?.id || 3,
            readTime: 10,
            viewCount: 312,
            isPublished: true,
            isFeatured: true,
            metaTitle: "Karavan ile Türkiye Turu - Viya Kaptan",
            metaDescription: "Türkiye'nin en iyi karavan kamp alanları ve rota önerileri.",
            publishedAt: new Date("2026-01-05"),
        },
        {
            title: "Denizde Güvenlik: Temel Kurallar ve Acil Durum Prosedürleri",
            slug: "denizde-guvenlik-temel-kurallar",
            excerpt: "Denizde güvenliğiniz için bilmeniz gereken temel kurallar, ilk yardım bilgileri ve acil durum prosedürleri.",
            content: `<h2>Denizde Güvenlik Her Şeyden Önce</h2>
<p>Deniz güzel ama acımasız olabilir. Her tekne yolculuğunda güvenlik kurallarına uymak hayat kurtarır.</p>

<h3>Temel Güvenlik Kuralları</h3>
<ol>
<li>Can yeleğini her zaman giyin</li>
<li>Hava durumunu mutlaka kontrol edin</li>
<li>Rotanızı birilerine bildirin</li>
<li>Yeterli yiyecek ve su bulundurun</li>
<li>İlk yardım çantası taşıyın</li>
</ol>

<h3>Acil Durum Sinyalleri</h3>
<p>VHF kanal 16 her zaman acil durum kanalıdır. MAYDAY çağrısı nasıl yapılır mutlaka öğrenin. Işaret fişekleri ve duman kutuları teknede bulundurulmalıdır.</p>

<h3>Adam Düştü Prosedürü</h3>
<p>Denize düşen bir kişi için hızlı ve doğru hareket etmek gerekir. Williamson dönüşü ve kurtarma manevralarını tüm mürettebat bilmelidir.</p>`,
            featuredImage: img4,
            authorName: "Kaptan Mehmet",
            authorTitle: "Denizcilik Eğitmeni",
            categoryId: guvenlikCat?.id || 4,
            readTime: 7,
            viewCount: 456,
            isPublished: true,
            isFeatured: false,
            metaTitle: "Denizde Güvenlik Kuralları - Viya Kaptan",
            metaDescription: "Denizde güvenlik kuralları, acil durum prosedürleri ve ilk yardım bilgileri.",
            publishedAt: new Date("2026-01-20"),
        },
    ];

    for (const post of postsData) {
        await db.insert(schema.posts).values(post).onDuplicateKeyUpdate({ set: { title: post.title } });
    }
    console.log(`  ✅ ${postsData.length} blog yazısı eklendi`);
}

async function seedCaravanRoutes(db: any) {
    console.log("\n🗺️ Karavan rotaları ekleniyor...");

    const [routeImg1, routeImg2, routeImg3] = await Promise.all([
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
            "routes",
            "route-ege"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
            "routes",
            "route-karadeniz"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
            "routes",
            "route-akdeniz"
        ),
    ]);

    const routes = [
        {
            name: "Ege Kıyı Rotası",
            slug: "ege-kiyi-rotasi",
            description: "İzmir'den Muğla'ya uzanan muhteşem Ege sahil şeridi boyunca karavan rotası.",
            content: `<h2>Ege Kıyı Rotası</h2>
<p>Bu rota, Türkiye'nin en güzel sahillerinden bazılarını keşfetmenizi sağlar. İzmir'in kuzeyinden başlayıp, Çeşme yarımadası, Kuşadası, Didim üzerinden Bodrum'a kadar uzanan bu yol, mavi bayraklı plajları, antik kentleri ve lezzetli Ege mutfağını bir arada sunar.</p>

<h3>Öne Çıkan Duraklar</h3>
<ul>
<li><strong>Alaçatı:</strong> Rüzgar sörfü ve taş evleriyle ünlü</li>
<li><strong>Efes Antik Kenti:</strong> Tarihi keşifler için mükemmel</li>
<li><strong>Bodrum:</strong> Deniz, tarih ve eğlencenin buluşma noktası</li>
<li><strong>Datça Yarımadası:</strong> Sakin ve tabiatıyla büyüleyici</li>
</ul>`,
            featuredImage: routeImg1,
            distance: "650 km",
            duration: "10 gün",
            difficulty: "easy" as const,
            locations: JSON.stringify(["İzmir", "Çeşme", "Kuşadası", "Didim", "Bodrum", "Datça"]),
            highlights: JSON.stringify([
                "Alaçatı taş sokakları",
                "Efes Antik Kenti",
                "Bodrum Kalesi",
                "Datça badem çiçekleri",
                "Mavi bayraklı plajlar"
            ]),
            tips: JSON.stringify([
                "Yaz aylarında erken rezervasyon yapın",
                "Ege rüzgârları öğleden sonra güçlenir",
                "Zeytinyağlı yemekleri mutlaka deneyin",
                "Kamp alanlarını önceden araştırın"
            ]),
            isPublished: true,
            isFeatured: true,
            metaTitle: "Ege Kıyı Karavan Rotası - Viya Kaptan",
            metaDescription: "İzmir'den Bodrum'a uzanan en güzel Ege sahil karavan rotası.",
        },
        {
            name: "Karadeniz Yayla Rotası",
            slug: "karadeniz-yayla-rotasi",
            description: "Trabzon'dan Artvin'e uzanan yeşilin bin bir tonunu keşfettiğiniz yayla rotası.",
            content: `<h2>Karadeniz Yayla Rotası</h2>
<p>Karadeniz'in efsanevi yaylaları, sisli dağ yolları ve yemyeşil doğasıyla karavan macerası. Bu rota, Türkiye'nin en özel doğa güzelliklerini gözler önüne serer.</p>

<h3>Öne Çıkan Duraklar</h3>
<ul>
<li><strong>Uzungöl:</strong> Kartpostallık manzaralar</li>
<li><strong>Ayder Yaylası:</strong> Kaplıcaları ve yöresel lezzetleri</li>
<li><strong>Pokut Yaylası:</strong> Bulutların üzerinde kamping</li>
<li><strong>Artvin Şavşat:</strong> Karagöl'ün büyüleyici güzelliği</li>
</ul>`,
            featuredImage: routeImg2,
            distance: "450 km",
            duration: "7 gün",
            difficulty: "medium" as const,
            locations: JSON.stringify(["Trabzon", "Uzungöl", "Çamlıhemşin", "Ayder", "Pokut", "Artvin"]),
            highlights: JSON.stringify([
                "Uzungöl manzarası",
                "Ayder kaplıcaları",
                "Pokut bulut denizi",
                "Karagöl tabiat parkı",
                "Fırtına Deresi rafting"
            ]),
            tips: JSON.stringify([
                "Yağmurluk ve sıcak giysiler mutlaka alın",
                "Yayla yolları dar olabilir, dikkatli sürün",
                "Yerel balı ve peyniri deneyin",
                "Akşamları soğuk olabilir, ısıtma sisteminizi kontrol edin"
            ]),
            isPublished: true,
            isFeatured: true,
            metaTitle: "Karadeniz Yayla Karavan Rotası - Viya Kaptan",
            metaDescription: "Trabzon'dan Artvin'e muhteşem Karadeniz yayla karavan rotası.",
        },
        {
            name: "Akdeniz Likya Yolu Rotası",
            slug: "akdeniz-likya-yolu-rotasi",
            description: "Antalya'dan Fethiye'ye uzanan tarihi Likya Yolu boyunca karavan ve doğa rotası.",
            content: `<h2>Akdeniz Likya Yolu Rotası</h2>
<p>Dünyanın en güzel 10 uzun mesafe yürüyüş rotasından biri olan Likya Yolu boyunca karavan maceranız. Antik kentler, turkuaz koylar ve çam ormanları sizi bekliyor.</p>

<h3>Öne Çıkan Duraklar</h3>
<ul>
<li><strong>Olimpos:</strong> Antik kent ve yanardağ alevleri</li>
<li><strong>Kaş:</strong> Dalış cenneti ve butik atmosfer</li>
<li><strong>Patara:</strong> 18 km uzunluğundaki kumsalı ile ünlü</li>
<li><strong>Ölüdeniz:</strong> Turkuaz lagünü ve yamaç paraşütü</li>
</ul>`,
            featuredImage: routeImg3,
            distance: "350 km",
            duration: "8 gün",
            difficulty: "easy" as const,
            locations: JSON.stringify(["Antalya", "Olimpos", "Kaş", "Kalkan", "Patara", "Ölüdeniz", "Fethiye"]),
            highlights: JSON.stringify([
                "Olimpos yanardağ alevleri",
                "Kaş dalış noktaları",
                "Patara kumsalı",
                "Ölüdeniz lagünü",
                "Kelebekler Vadisi"
            ]),
            tips: JSON.stringify([
                "Yaz aylarında çok sıcak olabilir, güneşten korunun",
                "Denize girmek için mayo ve şnorkeli unutmayın",
                "Olimpos'ta açık hava kampı deneyimini yaşayın",
                "Kaş'ta tüplü dalış mutlaka deneyin"
            ]),
            isPublished: true,
            isFeatured: true,
            metaTitle: "Akdeniz Likya Yolu Karavan Rotası - Viya Kaptan",
            metaDescription: "Antalya'dan Fethiye'ye Likya Yolu boyunca karavan rotası.",
        },
    ];

    for (const route of routes) {
        await db.insert(schema.caravanRoutes).values(route).onDuplicateKeyUpdate({ set: { name: route.name } });
    }
    console.log(`  ✅ ${routes.length} karavan rotası eklendi`);
}

async function seedTeamMembers(db: any) {
    console.log("\n👥 Ekip üyeleri ekleniyor...");

    const [teamImg1, teamImg2, teamImg3] = await Promise.all([
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            "team",
            "team-mehmet"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            "team",
            "team-ayse"
        ),
        uploadToCloudinary(
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            "team",
            "team-ali"
        ),
    ]);

    const members = [
        {
            name: "Kaptan Mehmet Yıldız",
            title: "Kurucu & Kaptan",
            bio: "20 yılı aşkın denizcilik deneyimiyle Akdeniz ve Ege'nin tüm koylarını keşfetmiş bir deniz tutkunu. Yelken eğitimi ve deniz güvenliği konularında uzman.",
            image: teamImg1,
            email: "mehmet@viyakaptan.com",
            socialLinks: JSON.stringify({
                instagram: "https://instagram.com/viyakaptan",
                youtube: "https://youtube.com/viyakaptan",
            }),
            sortOrder: 1,
            isActive: true,
        },
        {
            name: "Ayşe Yılmaz",
            title: "İçerik Editörü & Karavan Gezgini",
            bio: "5 yıldır karavanla Türkiye'yi gezen, yazdığı gezi notlarıyla binlerce kişiye ilham veren bir maceraperest. Fotoğrafçılık ve video prodüksiyon konusunda uzman.",
            image: teamImg2,
            email: "ayse@viyakaptan.com",
            socialLinks: JSON.stringify({
                instagram: "https://instagram.com/viyakaptan",
            }),
            sortOrder: 2,
            isActive: true,
        },
        {
            name: "Ali Kaya",
            title: "Navigasyon Uzmanı",
            bio: "Deniz Harp Okulu mezunu, 15 yıllık navigasyon ve haritacılık deneyimine sahip. GPS sistemleri ve deniz navigasyonu eğitmenliği yapıyor.",
            image: teamImg3,
            email: "ali@viyakaptan.com",
            socialLinks: JSON.stringify({
                instagram: "https://instagram.com/viyakaptan",
            }),
            sortOrder: 3,
            isActive: true,
        },
    ];

    for (const member of members) {
        await db.insert(schema.teamMembers).values(member).onDuplicateKeyUpdate({ set: { name: member.name } });
    }
    console.log(`  ✅ ${members.length} ekip üyesi eklendi`);
}

async function seedSiteSettings(db: any) {
    console.log("\n⚙️ Site ayarları ekleniyor...");

    const settings = [
        { key: "site_title", value: "Viya Kaptan", type: "text" as const, group: "general", label: "Site Başlığı" },
        { key: "site_description", value: "Denizcilik ve Karavan Yaşam Rehberi", type: "text" as const, group: "general", label: "Site Açıklaması" },
        { key: "contact_email", value: "info@viyakaptan.com", type: "text" as const, group: "contact", label: "İletişim Email" },
        { key: "contact_phone", value: "+90 532 000 0000", type: "text" as const, group: "contact", label: "Telefon" },
        { key: "social_instagram", value: "https://instagram.com/viyakaptan", type: "text" as const, group: "social", label: "Instagram" },
        { key: "social_youtube", value: "https://youtube.com/viyakaptan", type: "text" as const, group: "social", label: "YouTube" },
        { key: "footer_text", value: "© 2026 Viya Kaptan. Tüm hakları saklıdır.", type: "text" as const, group: "general", label: "Footer Metni" },
        { key: "meta_title", value: "Viya Kaptan - Denizcilik ve Karavan Yaşam", type: "text" as const, group: "seo", label: "Meta Başlık" },
        { key: "meta_description", value: "Yelken eğitimi, denizcilik bilgileri, karavan rotaları ve gezi rehberleri. Türkiye'nin en kapsamlı denizcilik ve karavan yaşam platformu.", type: "textarea" as const, group: "seo", label: "Meta Açıklama" },
    ];

    for (const setting of settings) {
        await db.insert(schema.siteSettings).values(setting).onDuplicateKeyUpdate({ set: { value: setting.value } });
    }
    console.log(`  ✅ ${settings.length} site ayarı eklendi`);
}

// ==================== MAIN ====================

async function main() {
    console.log("🚀 Viya Kaptan Seed Başlıyor...");
    console.log("================================\n");

    // Verify env
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL tanımlı değil!");
        process.exit(1);
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("⚠️  CLOUDINARY_CLOUD_NAME tanımlı değil. Fotoğraflar yüklenmeyecek.");
    }

    const db = await getDb();

    try {
        // Seed in order (categories first, then posts that reference them)
        const categories = await seedCategories(db);
        await seedHeroSection(db);
        await seedFeatureCards(db);
        await seedPosts(db, categories);
        await seedCaravanRoutes(db);
        await seedTeamMembers(db);
        await seedSiteSettings(db);

        console.log("\n================================");
        console.log("🎉 Tüm veriler başarıyla eklendi!");
        console.log("================================\n");
    } catch (error) {
        console.error("\n❌ Seed hatası:", error);
        process.exit(1);
    }

    process.exit(0);
}

main();
