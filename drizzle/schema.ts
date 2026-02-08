import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories table - Denizcilik, Karavan etc.
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }), // RemixIcon class name
  color: varchar("color", { length: 50 }), // Tailwind color class
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Posts table - Blog posts for Denizcilik section
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"), // Short description
  content: text("content"), // Full HTML content
  featuredImage: text("featuredImage"), // S3 URL or external URL
  authorName: varchar("authorName", { length: 255 }),
  authorTitle: varchar("authorTitle", { length: 255 }),
  authorImage: text("authorImage"),
  categoryId: int("categoryId").references(() => categories.id),
  readTime: int("readTime").default(5), // Minutes
  viewCount: int("viewCount").default(0),
  isPublished: boolean("isPublished").default(false),
  isFeatured: boolean("isFeatured").default(false),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Caravan Routes table - Karavan rotaları
 */
export const caravanRoutes = mysqlTable("caravan_routes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  content: text("content"), // Full HTML content
  featuredImage: text("featuredImage"),
  distance: varchar("distance", { length: 50 }), // e.g., "450 km"
  duration: varchar("duration", { length: 50 }), // e.g., "7 gün"
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
  locations: json("locations"), // Array of location names
  highlights: json("highlights"), // Array of highlights
  tips: json("tips"), // Array of tips
  gallery: json("gallery"), // Array of image URLs
  mapCoordinates: json("mapCoordinates"), // Lat/lng points
  isPublished: boolean("isPublished").default(false),
  isFeatured: boolean("isFeatured").default(false),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaravanRoute = typeof caravanRoutes.$inferSelect;
export type InsertCaravanRoute = typeof caravanRoutes.$inferInsert;

/**
 * Site Settings table - Global site configuration
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: mysqlEnum("type", ["text", "textarea", "image", "json", "boolean"]).default("text"),
  group: varchar("group", { length: 50 }), // general, contact, social, seo
  label: varchar("label", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Pages table - Static pages like About, Contact
 */
export const pages = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content"),
  featuredImage: text("featuredImage"),
  template: varchar("template", { length: 50 }).default("default"), // default, about, contact
  isPublished: boolean("isPublished").default(false),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

/**
 * Hero Sections table - Homepage hero content
 */
export const heroSections = mysqlTable("hero_sections", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  backgroundImage: text("backgroundImage"),
  primaryButtonText: varchar("primaryButtonText", { length: 100 }),
  primaryButtonLink: varchar("primaryButtonLink", { length: 255 }),
  secondaryButtonText: varchar("secondaryButtonText", { length: 100 }),
  secondaryButtonLink: varchar("secondaryButtonLink", { length: 255 }),
  isActive: boolean("isActive").default(true),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeroSection = typeof heroSections.$inferSelect;
export type InsertHeroSection = typeof heroSections.$inferInsert;

/**
 * Feature Cards table - Homepage feature boxes
 */
export const featureCards = mysqlTable("feature_cards", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }), // RemixIcon class
  color: varchar("color", { length: 50 }), // Tailwind color
  link: varchar("link", { length: 255 }),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeatureCard = typeof featureCards.$inferSelect;
export type InsertFeatureCard = typeof featureCards.$inferInsert;

/**
 * Team Members table - About page team section
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  image: text("image"),
  email: varchar("email", { length: 255 }),
  socialLinks: json("socialLinks"), // { instagram, twitter, linkedin }
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Media table - Uploaded files/images
 */
export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }),
  mimeType: varchar("mimeType", { length: 100 }),
  size: int("size"), // bytes
  url: text("url").notNull(),
  s3Key: varchar("s3Key", { length: 500 }),
  alt: varchar("alt", { length: 255 }),
  caption: text("caption"),
  uploadedBy: int("uploadedBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;
