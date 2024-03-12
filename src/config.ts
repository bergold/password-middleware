import { ResponseCookie } from "./deps.ts";
import { iron } from "./deps.ts";

export type SealOptions = iron.SealOptions;
export type CookieOptions = Omit<ResponseCookie, "value">;

/**
 * Configuration options
 */
export interface Config {
  /**
   * Whether the middleware is in development mode.
   *
   * @default false
   */
  dev?: boolean;

  /**
   * The password to use for protection.
   * Can be an array of passwords.
   */
  password: string | Array<string>;

  /**
   * Used to sign and encrypt the cookie
   *
   * @example
   * ```sh
   * openssl rand -base64 24
   * ```
   */
  secret: string;

  /**
   * Route where the authentication form is located.
   *
   * @default "/auth"
   */
  route?: string;

  /**
   * The options for the cookie.
   */
  sealOptions?: SealOptions;

  /**
   * The options for the cookie.
   */
  cookieOptions?: CookieOptions;

  /**
   * Custom theme for the protection form.
   */
  theme?: {
    /**
     * Used as the accent color for the protection form.
     */
    brandColor?: string;

    /**
     * Absolute URL to the logo.
     */
    logo?: string;
  };
}

/** Merges provided config with default values */
export function resolveConfig(config: Config) {
  const dev = config.dev ?? false;
  const ttl = config.sealOptions?.ttl ?? iron.defaults.ttl;
  const cookieOptionsDefaults = {
    name: (dev ? "" : "__Secure-") + "middleware-session",
    httpOnly: true,
    secure: !dev,
    sameSite: "lax",
    path: "/",
    maxAge: (ttl === 0 ? 2147483647 : ttl) - 60, // Expire cookie before the session expires.
  } satisfies CookieOptions;
  return {
    ...config,
    dev: config.dev ?? false,
    route: config.route ?? "/auth",
    sealOptions: { ...iron.defaults, ...config.sealOptions },
    cookieOptions: { ...cookieOptionsDefaults, ...config.cookieOptions },
  };
}

export type ResolvedConfig = ReturnType<typeof resolveConfig>;
