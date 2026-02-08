import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Mock context for admin procedures
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Homepage API", () => {
  it("should return homepage data with hero, features, posts, routes and settings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.homepage.getData();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("hero");
    expect(result).toHaveProperty("features");
    expect(result).toHaveProperty("posts");
    expect(result).toHaveProperty("routes");
    expect(result).toHaveProperty("settings");
  });
});

describe("Categories API", () => {
  it("should list categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.list({ activeOnly: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Posts API", () => {
  it("should list published posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.posts.list({ publishedOnly: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get post by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.posts.getBySlug({ slug: "gun-batiminda-yelken-acmak" });

    expect(result).toBeDefined();
    if (result) {
      expect(result.slug).toBe("gun-batiminda-yelken-acmak");
      expect(result.title).toBeDefined();
    }
  });
});

describe("Caravan Routes API", () => {
  it("should list published caravan routes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.caravanRoutes.list({ publishedOnly: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get caravan route by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.caravanRoutes.getBySlug({ slug: "ege-kiyi-rotasi" });

    expect(result).toBeDefined();
    if (result) {
      expect(result.slug).toBe("ege-kiyi-rotasi");
      expect(result.name).toBeDefined();
    }
  });
});

describe("Site Settings API", () => {
  it("should list site settings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.siteSettings.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Hero Sections API", () => {
  it("should list hero sections", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.heroSections.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get active hero section", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.heroSections.getActive();

    expect(result).toBeDefined();
    if (result) {
      expect(result.isActive).toBe(true);
    }
  });
});

describe("Feature Cards API", () => {
  it("should list feature cards", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.featureCards.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
