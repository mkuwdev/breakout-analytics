# Colosseum Hackathon Analytics Dashboard

A beautiful, feature-rich dashboard for exploring Colosseum hackathon projects with advanced filtering, analytics, and project discovery.

## Features

- 🎯 **Multi-Hackathon Support**: Switch between different Colosseum hackathons
- 🔍 **Advanced Filtering**: Filter by tracks, countries, team size, links, and more
- 📊 **Analytics Dashboard**: Comprehensive analytics with charts and insights
- 🎲 **Project Spotlight**: Random project discovery feature
- 📱 **Responsive Design**: Works beautifully on all devices
- ⚡ **Fast & Optimized**: Built with Next.js 15 and React 19

## Hackathons

Currently supported hackathons:
- **Cypherpunk** (Default) - `/cypherpunk`
- **Breakout** - `/breakout`

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Add Cypherpunk logo:**
   - Place your Cypherpunk logo at `/public/cypherpunk-logo.png`
   - Or update the logo path in `/lib/hackathons.ts`

3. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**
   - You'll be redirected to `/cypherpunk` (the default hackathon)

## Project Structure

```
app/
  [hackathon]/        # Dynamic route for hackathon pages
    page.tsx          # Hackathon dashboard page
  api/
    projects/         # API route for fetching projects
  page.tsx            # Root page (redirects to default)
components/
  dashboard.tsx       # Main dashboard component
  hackathon-selector.tsx  # Hackathon switcher component
lib/
  hackathons.ts       # Hackathon configuration
```

## Adding a New Hackathon

1. **Update `/lib/hackathons.ts`:**
   ```typescript
   {
     id: 6,                    // Hackathon ID from Colosseum API
     slug: "new-hackathon",    // URL slug
     name: "New Hackathon",     // Display name
     logo: "/new-logo.png",     // Logo path
     description: "Description",
     isDefault: false,         // Set to true to make it default
   }
   ```

2. **Add the logo to `/public/`**

3. **Update `generateStaticParams` in `app/[hackathon]/page.tsx`** if using static generation

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy!

### Custom Domain Setup

See [SUBDOMAIN_SETUP.md](./SUBDOMAIN_SETUP.md) for instructions on setting up `colosseum.frontseat.co`.

## API

The dashboard fetches data from:
- `/api/projects?hackathonId={id}` - Returns projects for a specific hackathon

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## License

MIT

## Credits

Made by [Figo](https://x.com/figo_saleh)

