export const ENV = {
  appId: process.env.VITE_APP_ID ?? "demo-app",
  cookieSecret: process.env.JWT_SECRET ?? "default-secret-key-change-in-production-min-32-chars",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "", // Optional for mock data mode
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

