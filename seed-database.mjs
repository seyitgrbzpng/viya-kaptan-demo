import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const seedData = JSON.parse(readFileSync('./seed_data.json', 'utf-8'));

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('🌱 Starting database seed...');

  try {
    // 1. Seed Categories
    console.log('📁 Seeding categories...');
    for (const cat of seedData.categories) {
      await connection.execute(
        `INSERT INTO categories (name, slug, description, icon, color, isActive, sortOrder)
         VALUES (?, ?, ?, ?, ?, true, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon), color=VALUES(color)`,
        [cat.name, cat.slug, cat.description, cat.icon, cat.color, seedData.categories.indexOf(cat) + 1]
      );
    }
    console.log(`✅ ${seedData.categories.length} categories seeded`);

    // Get category IDs
    const [categories] = await connection.execute('SELECT id, slug FROM categories');
    const categoryMap = {};
    categories.forEach(c => categoryMap[c.slug] = c.id);

    // 2. Seed Hero
    console.log('🎯 Seeding hero section...');
    const hero = seedData.hero;
    await connection.execute(
      `INSERT INTO hero_sections (title, subtitle, backgroundImage, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, true)`,
      [hero.title, hero.subtitle, hero.backgroundImage, hero.primaryButtonText, hero.primaryButtonLink, hero.secondaryButtonText, hero.secondaryButtonLink]
    );
    console.log('✅ Hero section seeded');

    // 3. Seed Features
    console.log('⭐ Seeding features...');
    for (const feature of seedData.features) {
      await connection.execute(
        `INSERT INTO feature_cards (title, description, icon, link, sortOrder, isActive)
         VALUES (?, ?, ?, ?, ?, true)`,
        [feature.title, feature.description, feature.icon, feature.link, feature.sortOrder]
      );
    }
    console.log(`✅ ${seedData.features.length} features seeded`);

    // 4. Seed Posts
    console.log('📝 Seeding posts...');
    for (const post of seedData.posts) {
      const categoryId = categoryMap[post.categorySlug] || null;
      await connection.execute(
        `INSERT INTO posts (title, slug, excerpt, content, featuredImage, categoryId, status, publishedAt, readTime, authorName, authorTitle, viewCount)
         VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, 0)
         ON DUPLICATE KEY UPDATE title=VALUES(title), excerpt=VALUES(excerpt), content=VALUES(content)`,
        [post.title, post.slug, post.excerpt, post.content, post.featuredImage, categoryId, post.publishedAt, post.readTime, post.authorName, post.authorTitle]
      );
    }
    console.log(`✅ ${seedData.posts.length} posts seeded`);

    // 5. Seed Caravan Routes
    console.log('🚐 Seeding caravan routes...');
    for (const route of seedData.caravanRoutes) {
      await connection.execute(
        `INSERT INTO caravan_routes (name, slug, description, content, featuredImage, distance, duration, difficulty, locations, highlights, tips, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), content=VALUES(content)`,
        [route.name, route.slug, route.description, route.content, route.featuredImage, route.distance, route.duration, route.difficulty, JSON.stringify(route.locations), JSON.stringify(route.highlights), JSON.stringify(route.tips)]
      );
    }
    console.log(`✅ ${seedData.caravanRoutes.length} caravan routes seeded`);

    // 6. Seed Site Settings
    console.log('⚙️ Seeding site settings...');
    for (const [key, value] of Object.entries(seedData.settings)) {
      await connection.execute(
        `INSERT INTO site_settings (\`key\`, value, type, \`group\`, label)
         VALUES (?, ?, 'text', ?, ?)
         ON DUPLICATE KEY UPDATE value=VALUES(value)`,
        [key, value, key.split('_')[0], key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())]
      );
    }
    console.log(`✅ ${Object.keys(seedData.settings).length} settings seeded`);

    console.log('\\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
