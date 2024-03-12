import { NextResponse, iron } from "./deps.ts";
import { Config, ResolvedConfig } from "./config.ts";

interface Session {
  iat: number;
}

export async function verifySession(
  config: ResolvedConfig,
  cookieValue: string | undefined
) {
  if (!cookieValue) return null;
  try {
    return (await iron.unseal(
      globalThis.crypto,
      cookieValue,
      config.secret,
      config.sealOptions
    )) as Session;
  } catch (_e) {
    return null;
  }
}

export async function createSession(config: ResolvedConfig) {
  const session = { iat: Date.now() };
  const cookie = await iron.seal(
    globalThis.crypto,
    session,
    config.secret,
    config.sealOptions
  );
  return cookie;
}

export function checkPassword(config: Config, password: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(password);
  let match = false;
  const passwords = Array.isArray(config.password)
    ? config.password
    : [config.password];
  for (const password of passwords) {
    const b = encoder.encode(password);
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a[i]! ^ b[i]!;
    }
    match ||= result === 0;
  }
  return match;
}

export function redirectToAuth(config: ResolvedConfig, request: Request) {
  const current = new URL(request.url);
  const target = new URL(config.route, request.url);
  target.searchParams.set("next", current.pathname + current.search);
  return new Response(null, {
    status: 307,
    headers: {
      location: target.toString(),
    },
  });
}

export function redirectToNext(_config: ResolvedConfig, request: Request) {
  const current = new URL(request.url);
  const next = new URL(current.searchParams.get("next") ?? "/", request.url);
  return new NextResponse(null, {
    status: 303,
    headers: {
      location: next.toString(),
    },
  });
}
