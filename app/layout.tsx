import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alex Morgan | Software Engineering Portfolio',
  description:
    'Portfolio of Alex Morgan, a Software Engineering student focused on backend systems, APIs, and data processing.',
  keywords: ['Software Engineer', 'Backend Developer', 'Python', 'API', 'Portfolio'],
  openGraph: {
    title: 'Alex Morgan | Software Engineering Portfolio',
    description:
      'Modern developer portfolio highlighting backend projects, technical skills, and software engineering experience.',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
