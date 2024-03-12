/**
 * A module providing middleware helpers for adding password protection to a site.
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { passwordMiddleware } from "@bergold/password-middleware";
 *
 * export const middleware = passwordMiddleware({
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

import { Config, resolveConfig } from "./config.ts";
import { NextRequest, NextResponse } from "./deps.ts";
import { checkPassword, createSession, redirectToNext } from "./lib.ts";
import { redirectToAuth, verifySession } from "./lib.ts";
import { template } from "./template.ts";

/**
 * Factory function for creating a password middleware.
 */
export function passwordMiddleware(
  config: Config,
): (req: NextRequest) => Promise<Response> {
  const resolvedConfig = resolveConfig(config);
  if (!resolvedConfig.secret) {
    throw new Error("The secret is required.");
  }
  if (!resolvedConfig.password) {
    throw new Error("The password is required.");
  }

  return async (req: NextRequest) => {
    const session = await verifySession(
      resolvedConfig,
      req.cookies.get(resolvedConfig.cookieOptions.name)?.value,
    );
    if (req.nextUrl.pathname === resolvedConfig.route) {
      if (session) {
        return redirectToNext(resolvedConfig, req);
      } else {
        if (req.method === "GET") {
          return new NextResponse(template({ theme: resolvedConfig.theme }), {
            status: 200,
            headers: {
              "content-type": "text/html; charset=utf-8",
            },
          });
        } else if (req.method === "POST") {
          if (req.nextUrl.origin !== req.headers.get("origin")) {
            console.warn(
              "CSRF check failed, origin:",
              req.headers.get("origin"),
            );
            return new NextResponse(null, { status: 403 });
          }
          const body = await req.formData();
          const password = body.get("password");
          if (
            typeof password === "string" &&
            checkPassword(resolvedConfig, password)
          ) {
            const value = await createSession(resolvedConfig);
            const response = redirectToNext(resolvedConfig, req);
            response.cookies.set({
              ...resolvedConfig.cookieOptions,
              value,
            });
            return response;
          } else {
            console.warn("Wrong password");
            return new NextResponse(
              template({
                error: "Password does not match",
                theme: resolvedConfig.theme,
              }),
              {
                status: 200,
                headers: {
                  "content-type": "text/html; charset=utf-8",
                },
              },
            );
          }
        } else {
          return new NextResponse(null, {
            status: 405,
            headers: { Allow: "GET, POST" },
          });
        }
      }
    } else {
      if (!session) {
        return redirectToAuth(resolvedConfig, req);
      } else {
        return NextResponse.next();
      }
    }
  };
}
