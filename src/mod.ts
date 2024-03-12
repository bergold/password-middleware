/**
 * A module providing middleware helpers for adding password protection to a site.
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { passwordMiddleware } from "@bergold/password-middleware";
 *
 * export const middleware = passwordMiddleware({
 *   dev: process.env.NODE_ENV !== "production",
 *   secret: process.env.SECRET,
 *   password: process.env.PASSWORD,
 * });
 *
 * export const config = {
 *   matcher: [
 *     // Match all request paths except for the ones starting with:
 *     // - _next/static (static files)
 *     // - _next/image (image optimization files)
 *     // - favicon.ico (favicon file)
 *     "/((?!_next/static|_next/image|favicon.ico).*)",
 *   ],
 * };
 * ```
 *
 * @module
 */

export { passwordMiddleware } from "./middleware.ts";
export type { Config, CookieOptions, SealOptions } from "./config.ts";
