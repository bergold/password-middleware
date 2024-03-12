# password middleware

> [!IMPORTANT]  
> This package is work-in-progress. Use with care!

Middleware to protect your deployments from public access.

## Quick start

1. Install

   ```sh
   npx jsr add @bergold/password-middleware
   ```

2. Setup middleware

   ```ts
   import { passwordMiddleware } from "@bergold/password-middleware";

   export const middleware = passwordMiddleware({
     secret: process.env.SECRET,
     password: process.env.PASSWORD,
   });

   export const config = {
     matcher: [
       // Match all request paths except for the ones starting with:
       // - _next/static (static files)
       // - _next/image (image optimization files)
       // - favicon.ico (favicon file)
       "/((?!_next/static|_next/image|favicon.ico).*)",
     ],
   };
   ```
