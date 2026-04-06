# Personal Developer Portfolio (Next.js + TypeScript + Tailwind)

A modern, dark-themed, responsive personal portfolio built for backend-focused software engineering profiles.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm run start
```

## Edit your content

All editable personal content is centralized in:

- `data/siteData.ts`

Update your:

- Name, role, bio, and contact info
- Skills categories and items
- Project cards and links
- Education/experience timeline
- Social links and CV URL

## Deploy

### Vercel (recommended)

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Keep default build settings (`next build`).
4. Deploy.

### Any Node hosting

1. Build with `npm run build`
2. Run with `npm run start`
3. Serve on Node.js 18+ environment.

## Notes

- Contact form currently includes front-end validation and UI only.
- Connect it to your preferred backend endpoint, API route, or form provider.
- Replace `public/cv-placeholder.pdf` and `public/favicon.ico` with real assets.
