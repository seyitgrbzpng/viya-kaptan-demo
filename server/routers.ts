import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Admin procedure - only allows admin users
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== CATEGORIES ====================
  categories: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllCategories(input?.activeOnly ?? false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getCategoryById(input.id);
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return db.getCategoryBySlug(input.slug);
    }),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      return db.createCategory(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCategory(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCategory(input.id);
      return { success: true };
    }),
  }),

  // ==================== POSTS ====================
  posts: router({
    list: publicProcedure.input(z.object({ 
      publishedOnly: z.boolean().optional(),
      limit: z.number().optional()
    }).optional()).query(async ({ input }) => {
      return db.getAllPosts(input?.publishedOnly ?? false, input?.limit);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getPostById(input.id);
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const post = await db.getPostBySlug(input.slug);
      if (post) {
        await db.incrementPostViewCount(post.id);
      }
      return post;
    }),
    getByCategory: publicProcedure.input(z.object({ 
      categoryId: z.number(),
      publishedOnly: z.boolean().optional()
    })).query(async ({ input }) => {
      return db.getPostsByCategory(input.categoryId, input.publishedOnly ?? true);
    }),
    getFeatured: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return db.getFeaturedPosts(input?.limit ?? 3);
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      authorName: z.string().optional(),
      authorTitle: z.string().optional(),
      authorImage: z.string().optional(),
      categoryId: z.number().optional(),
      readTime: z.number().optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      publishedAt: z.date().optional(),
    })).mutation(async ({ input }) => {
      return db.createPost(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      authorName: z.string().optional(),
      authorTitle: z.string().optional(),
      authorImage: z.string().optional(),
      categoryId: z.number().nullable().optional(),
      readTime: z.number().optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      publishedAt: z.date().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updatePost(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deletePost(input.id);
      return { success: true };
    }),
  }),

  // ==================== CARAVAN ROUTES ====================
  caravanRoutes: router({
    list: publicProcedure.input(z.object({ publishedOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllCaravanRoutes(input?.publishedOnly ?? false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getCaravanRouteById(input.id);
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return db.getCaravanRouteBySlug(input.slug);
    }),
    getFeatured: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return db.getFeaturedCaravanRoutes(input?.limit ?? 3);
    }),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      distance: z.string().optional(),
      duration: z.string().optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      locations: z.array(z.string()).optional(),
      highlights: z.array(z.string()).optional(),
      tips: z.array(z.string()).optional(),
      gallery: z.array(z.string()).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })).mutation(async ({ input }) => {
      return db.createCaravanRoute(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      distance: z.string().optional(),
      duration: z.string().optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      locations: z.array(z.string()).optional(),
      highlights: z.array(z.string()).optional(),
      tips: z.array(z.string()).optional(),
      gallery: z.array(z.string()).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCaravanRoute(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCaravanRoute(input.id);
      return { success: true };
    }),
  }),

  // ==================== SITE SETTINGS ====================
  siteSettings: router({
    list: publicProcedure.query(async () => {
      return db.getAllSiteSettings();
    }),
    getByGroup: publicProcedure.input(z.object({ group: z.string() })).query(async ({ input }) => {
      return db.getSiteSettingsByGroup(input.group);
    }),
    getByKey: publicProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
      return db.getSiteSettingByKey(input.key);
    }),
    upsert: adminProcedure.input(z.object({
      key: z.string().min(1),
      value: z.string().optional(),
      type: z.enum(['text', 'textarea', 'image', 'json', 'boolean']).optional(),
      group: z.string().optional(),
      label: z.string().optional(),
      description: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.upsertSiteSetting(input);
      return { success: true };
    }),
    bulkUpsert: adminProcedure.input(z.array(z.object({
      key: z.string().min(1),
      value: z.string().optional(),
      type: z.enum(['text', 'textarea', 'image', 'json', 'boolean']).optional(),
      group: z.string().optional(),
      label: z.string().optional(),
      description: z.string().optional(),
    }))).mutation(async ({ input }) => {
      for (const setting of input) {
        await db.upsertSiteSetting(setting);
      }
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ key: z.string() })).mutation(async ({ input }) => {
      await db.deleteSiteSetting(input.key);
      return { success: true };
    }),
  }),

  // ==================== PAGES ====================
  pages: router({
    list: publicProcedure.input(z.object({ publishedOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllPages(input?.publishedOnly ?? false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getPageById(input.id);
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return db.getPageBySlug(input.slug);
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      template: z.string().optional(),
      isPublished: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      return db.createPage(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      template: z.string().optional(),
      isPublished: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updatePage(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deletePage(input.id);
      return { success: true };
    }),
  }),

  // ==================== HERO SECTIONS ====================
  heroSections: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllHeroSections(input?.activeOnly ?? false);
    }),
    getActive: publicProcedure.query(async () => {
      return db.getActiveHeroSection();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getHeroSectionById(input.id);
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      backgroundImage: z.string().optional(),
      primaryButtonText: z.string().optional(),
      primaryButtonLink: z.string().optional(),
      secondaryButtonText: z.string().optional(),
      secondaryButtonLink: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      return db.createHeroSection(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      backgroundImage: z.string().optional(),
      primaryButtonText: z.string().optional(),
      primaryButtonLink: z.string().optional(),
      secondaryButtonText: z.string().optional(),
      secondaryButtonLink: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateHeroSection(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteHeroSection(input.id);
      return { success: true };
    }),
  }),

  // ==================== FEATURE CARDS ====================
  featureCards: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllFeatureCards(input?.activeOnly ?? false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getFeatureCardById(input.id);
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      link: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      return db.createFeatureCard(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      link: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateFeatureCard(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteFeatureCard(input.id);
      return { success: true };
    }),
  }),

  // ==================== TEAM MEMBERS ====================
  teamMembers: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => {
      return db.getAllTeamMembers(input?.activeOnly ?? false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getTeamMemberById(input.id);
    }),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      title: z.string().optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      email: z.string().optional(),
      socialLinks: z.record(z.string(), z.string()).optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      return db.createTeamMember(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      title: z.string().optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      email: z.string().optional(),
      socialLinks: z.record(z.string(), z.string()).optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateTeamMember(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteTeamMember(input.id);
      return { success: true };
    }),
  }),

  // ==================== MEDIA ====================
  media: router({
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return db.getAllMedia(input?.limit ?? 50);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getMediaById(input.id);
    }),
    upload: adminProcedure.input(z.object({
      filename: z.string(),
      base64: z.string(),
      mimeType: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(input.base64, 'base64');
      const ext = input.filename.split('.').pop() || 'jpg';
      const s3Key = `media/${nanoid()}.${ext}`;
      
      const { url } = await storagePut(s3Key, buffer, input.mimeType);
      
      const mediaData = {
        filename: input.filename,
        originalName: input.filename,
        mimeType: input.mimeType,
        size: buffer.length,
        url,
        s3Key,
        alt: input.alt || null,
        caption: input.caption || null,
        uploadedBy: ctx.user.id,
      };
      const result = await db.createMedia(mediaData);
      
      return { id: result.id, url };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteMedia(input.id);
      return { success: true };
    }),
  }),

  // ==================== DASHBOARD ====================
  dashboard: router({
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),

  // ==================== PUBLIC HOMEPAGE DATA ====================
  homepage: router({
    getData: publicProcedure.query(async () => {
      const [hero, features, posts, routes, settings] = await Promise.all([
        db.getActiveHeroSection(),
        db.getAllFeatureCards(true),
        db.getFeaturedPosts(3),
        db.getFeaturedCaravanRoutes(3),
        db.getAllSiteSettings(),
      ]);
      
      const settingsMap: Record<string, string> = {};
      settings.forEach(s => {
        if (s.value) settingsMap[s.key] = s.value;
      });
      
      return { hero, features, posts, routes, settings: settingsMap };
    }),
  }),
});

export type AppRouter = typeof appRouter;
