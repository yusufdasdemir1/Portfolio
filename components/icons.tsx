import type { SVGProps } from 'react';

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a12 12 0 00-3.79 23.39c.6.12.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.54-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.33 3.3 1.23a11.39 11.39 0 016 0c2.29-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.78.84 1.24 1.92 1.24 3.23 0 4.6-2.81 5.61-5.49 5.91.44.38.83 1.12.83 2.27v3.37c0 .32.22.71.83.58A12 12 0 0012 .5z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.34 18.34H5.66V9.72h2.68v8.62zM7 8.55A1.55 1.55 0 118.55 7 1.55 1.55 0 017 8.55zM18.34 18.34h-2.67v-4.19c0-1-.02-2.28-1.39-2.28s-1.6 1.09-1.6 2.21v4.26H10V9.72h2.56v1.18h.04a2.81 2.81 0 012.53-1.39c2.7 0 3.2 1.78 3.2 4.09v4.74z" />
    </svg>
  );
}

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
