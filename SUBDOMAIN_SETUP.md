# Subdomain Setup for colosseum.frontseat.co

This guide explains how to set up the `colosseum.frontseat.co` subdomain to point to this Vercel project.

## Option 1: Vercel Subdomain (Recommended)

1. **In your Vercel dashboard:**
   - Go to your project settings
   - Navigate to "Domains"
   - Add `colosseum.frontseat.co` as a custom domain
   - Follow Vercel's DNS instructions

2. **In your DNS provider (where frontseat.co is managed):**
   - Add a CNAME record:
     - Name: `colosseum`
     - Value: `cname.vercel-dns.com` (or the value Vercel provides)
   - Wait for DNS propagation (can take a few minutes to 48 hours)

## Option 2: Using Rewrites from Main Domain

If you want to host this on your main domain's Vercel project:

1. **In your main project's `vercel.json`:**
   ```json
   {
     "rewrites": [
       {
         "source": "/colosseum/:path*",
         "destination": "https://breakout-analytics.vercel.app/:path*"
       }
     ]
   }
   ```

2. **Or use middleware in your main project:**
   ```typescript
   // middleware.ts in your main project
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     if (request.nextUrl.pathname.startsWith('/colosseum')) {
       const url = request.nextUrl.clone();
       url.href = `https://breakout-analytics.vercel.app${url.pathname.replace('/colosseum', '')}${url.search}`;
       return NextResponse.rewrite(url);
     }
   }

   export const config = {
     matcher: '/colosseum/:path*',
   };
   ```

## Option 3: Separate Vercel Project with Custom Domain

1. Deploy this project to Vercel
2. Add `colosseum.frontseat.co` as a custom domain in Vercel
3. Configure DNS as shown in Option 1

## Testing

Once set up, you should be able to access:
- `https://colosseum.frontseat.co` → Redirects to `/cypherpunk`
- `https://colosseum.frontseat.co/cypherpunk` → Cypherpunk dashboard
- `https://colosseum.frontseat.co/breakout` → Breakout dashboard

## Notes

- Make sure your DNS records are properly configured
- SSL certificates are automatically provisioned by Vercel
- The root path (`/`) automatically redirects to the default hackathon (Cypherpunk)

