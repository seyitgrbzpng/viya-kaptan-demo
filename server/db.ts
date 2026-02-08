import { eq, desc, asc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  categories, InsertCategory, Category,
  posts, InsertPost, Post,
  caravanRoutes, InsertCaravanRoute, CaravanRoute,
  siteSettings, InsertSiteSetting, SiteSetting,
  pages, InsertPage, Page,
  heroSections, InsertHeroSection, HeroSection,
  featureCards, InsertFeatureCard, FeatureCard,
  teamMembers, InsertTeamMember, TeamMember,
  media, InsertMedia, Media
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER FUNCTIONS ====================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CATEGORY FUNCTIONS ====================
export async function getAllCategories(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
  }
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return { id: result[0].insertId };
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ==================== POST FUNCTIONS ====================
export async function getAllPosts(publishedOnly = false, limit?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(posts);
  if (publishedOnly) {
    query = query.where(eq(posts.isPublished, true)) as typeof query;
  }
  query = query.orderBy(desc(posts.publishedAt)) as typeof query;
  if (limit) {
    query = query.limit(limit) as typeof query;
  }
  return query;
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0];
}

export async function getPostsByCategory(categoryId: number, publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(posts).where(and(eq(posts.categoryId, categoryId), eq(posts.isPublished, true))).orderBy(desc(posts.publishedAt));
  }
  return db.select().from(posts).where(eq(posts.categoryId, categoryId)).orderBy(desc(posts.publishedAt));
}

export async function getFeaturedPosts(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(and(eq(posts.isFeatured, true), eq(posts.isPublished, true))).orderBy(desc(posts.publishedAt)).limit(limit);
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(posts).values(data);
  return { id: result[0].insertId };
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(posts).where(eq(posts.id, id));
}

export async function incrementPostViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set({ viewCount: sql`${posts.viewCount} + 1` }).where(eq(posts.id, id));
}

// ==================== CARAVAN ROUTE FUNCTIONS ====================
export async function getAllCaravanRoutes(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(caravanRoutes).where(eq(caravanRoutes.isPublished, true)).orderBy(desc(caravanRoutes.createdAt));
  }
  return db.select().from(caravanRoutes).orderBy(desc(caravanRoutes.createdAt));
}

export async function getCaravanRouteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(caravanRoutes).where(eq(caravanRoutes.id, id)).limit(1);
  return result[0];
}

export async function getCaravanRouteBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(caravanRoutes).where(eq(caravanRoutes.slug, slug)).limit(1);
  return result[0];
}

export async function getFeaturedCaravanRoutes(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caravanRoutes).where(and(eq(caravanRoutes.isFeatured, true), eq(caravanRoutes.isPublished, true))).orderBy(desc(caravanRoutes.createdAt)).limit(limit);
}

export async function createCaravanRoute(data: InsertCaravanRoute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(caravanRoutes).values(data);
  return { id: result[0].insertId };
}

export async function updateCaravanRoute(id: number, data: Partial<InsertCaravanRoute>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(caravanRoutes).set(data).where(eq(caravanRoutes.id, id));
}

export async function deleteCaravanRoute(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(caravanRoutes).where(eq(caravanRoutes.id, id));
}

// ==================== SITE SETTINGS FUNCTIONS ====================
export async function getAllSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}

export async function getSiteSettingsByGroup(group: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings).where(eq(siteSettings.group, group));
}

export async function getSiteSettingByKey(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0];
}

export async function upsertSiteSetting(data: InsertSiteSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteSettings).values(data).onDuplicateKeyUpdate({
    set: { value: data.value, type: data.type, group: data.group, label: data.label, description: data.description }
  });
}

export async function deleteSiteSetting(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(siteSettings).where(eq(siteSettings.key, key));
}

// ==================== PAGE FUNCTIONS ====================
export async function getAllPages(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(asc(pages.sortOrder));
  }
  return db.select().from(pages).orderBy(asc(pages.sortOrder));
}

export async function getPageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  return result[0];
}

export async function getPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0];
}

export async function createPage(data: InsertPage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pages).values(data);
  return { id: result[0].insertId };
}

export async function updatePage(id: number, data: Partial<InsertPage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pages).set(data).where(eq(pages.id, id));
}

export async function deletePage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pages).where(eq(pages.id, id));
}

// ==================== HERO SECTION FUNCTIONS ====================
export async function getAllHeroSections(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(heroSections).where(eq(heroSections.isActive, true)).orderBy(asc(heroSections.sortOrder));
  }
  return db.select().from(heroSections).orderBy(asc(heroSections.sortOrder));
}

export async function getActiveHeroSection() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(heroSections).where(eq(heroSections.isActive, true)).orderBy(asc(heroSections.sortOrder)).limit(1);
  return result[0];
}

export async function getHeroSectionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(heroSections).where(eq(heroSections.id, id)).limit(1);
  return result[0];
}

export async function createHeroSection(data: InsertHeroSection) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(heroSections).values(data);
  return { id: result[0].insertId };
}

export async function updateHeroSection(id: number, data: Partial<InsertHeroSection>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(heroSections).set(data).where(eq(heroSections.id, id));
}

export async function deleteHeroSection(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(heroSections).where(eq(heroSections.id, id));
}

// ==================== FEATURE CARD FUNCTIONS ====================
export async function getAllFeatureCards(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(featureCards).where(eq(featureCards.isActive, true)).orderBy(asc(featureCards.sortOrder));
  }
  return db.select().from(featureCards).orderBy(asc(featureCards.sortOrder));
}

export async function getFeatureCardById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(featureCards).where(eq(featureCards.id, id)).limit(1);
  return result[0];
}

export async function createFeatureCard(data: InsertFeatureCard) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(featureCards).values(data);
  return { id: result[0].insertId };
}

export async function updateFeatureCard(id: number, data: Partial<InsertFeatureCard>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(featureCards).set(data).where(eq(featureCards.id, id));
}

export async function deleteFeatureCard(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(featureCards).where(eq(featureCards.id, id));
}

// ==================== TEAM MEMBER FUNCTIONS ====================
export async function getAllTeamMembers(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.sortOrder));
  }
  return db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0];
}

export async function createTeamMember(data: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMembers).values(data);
  return { id: result[0].insertId };
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// ==================== MEDIA FUNCTIONS ====================
export async function getAllMedia(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(media).orderBy(desc(media.createdAt)).limit(limit);
}

export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0];
}

export async function createMedia(data: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(media).values(data);
  return { id: result[0].insertId };
}

export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(media).where(eq(media.id, id));
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { posts: 0, routes: 0, categories: 0, pages: 0 };
  
  const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [routeCount] = await db.select({ count: sql<number>`count(*)` }).from(caravanRoutes);
  const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const [pageCount] = await db.select({ count: sql<number>`count(*)` }).from(pages);
  
  return {
    posts: Number(postCount?.count || 0),
    routes: Number(routeCount?.count || 0),
    categories: Number(categoryCount?.count || 0),
    pages: Number(pageCount?.count || 0)
  };
}
