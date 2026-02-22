/**
 * Hero bölümü fotoğrafını günceller - mavi yelkenli görsel
 * Çalıştırma: npx tsx server/update-hero.ts
 */
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { heroSections } from "../drizzle/schema";
import { eq } from "drizzle-orm";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    const db = drizzle(pool, { mode: "default" });

    console.log("⬆️  Mavi yelkenli hero fotoğrafı yükleniyor...");
    const result = await cloudinary.uploader.upload(
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=85",
        {
            folder: "viya-kaptan/hero",
            public_id: "hero-sailing-blue",
            overwrite: true,
        }
    );
    console.log("✅ Cloudinary'e yüklendi:", result.secure_url);

    await db
        .update(heroSections)
        .set({ backgroundImage: result.secure_url })
        .where(eq(heroSections.id, 1));

    console.log("✅ Hero bölümü güncellendi!");
    process.exit(0);
}

main().catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
});
