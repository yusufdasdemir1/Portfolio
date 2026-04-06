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

## Contact form email integration (SMTP)

The contact form supports:

- Required fields: `name`, `email`, `subject`, `message`
- Client + server validation
- Delivery through a Next.js API route (`/api/contact`) over SMTP
- Success/error feedback after submit
- Basic spam protection (honeypot + rate limiting)

### Environment variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Example `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_digit_app_password
CONTACT_TO_EMAIL=your_gmail@gmail.com
CONTACT_FROM_EMAIL=your_gmail@gmail.com
```

### Gmail SMTP quick setup

1. Enable 2-Step Verification in your Google account.
2. Create an App Password (16 chars) and use it as `SMTP_PASS` (paste without spaces).
3. Fill `.env.local` with your Gmail SMTP values.
4. Restart the app and test the contact form.

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
4. Add all `.env.local` variables in the Vercel project settings.
5. Deploy.

### Any Node hosting

1. Build with `npm run build`
2. Run with `npm run start`
3. Serve on Node.js 18+ environment.
4. Make sure environment variables are available at runtime.

## Notes

- SMTP route is implemented at `app/api/contact/route.ts`.
- Default SMTP configuration targets Gmail SSL (`smtp.gmail.com:465`).
- Replace `public/cv-placeholder.pdf` and `public/favicon.ico` with real assets.
