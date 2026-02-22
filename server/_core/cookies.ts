import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}


function getCookieDomainFromHost(hostname: string): string | undefined {
  const configured = process.env.SESSION_COOKIE_DOMAIN;
  if (configured) return configured;
  if (!hostname) return undefined;
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) return undefined;

  const parts = hostname.split(".").filter(Boolean);
  // Best-effort: use eTLD+1 for common domains (e.g. example.com). For complex TLDs, set SESSION_COOKIE_DOMAIN explicitly.
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join(".")}`;
  }
  return undefined;
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  // const hostname = req.hostname;
  // const shouldSetDomain =
  //   hostname &&
  //   !LOCAL_HOSTS.has(hostname) &&
  //   !isIpAddress(hostname) &&
  //   hostname !== "127.0.0.1" &&
  //   hostname !== "::1";

  // const domain =
  //   shouldSetDomain && !hostname.startsWith(".")
  //     ? `.${hostname}`
  //     : shouldSetDomain
  //       ? hostname
  //       : undefined;

  const domain = getCookieDomainFromHost(req.hostname);
  const secure = isSecureRequest(req);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" as const : "lax" as const,
    secure,
  };
}
