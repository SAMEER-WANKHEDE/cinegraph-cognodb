import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CineGraph',
  description: 'Explore movie relationships with a graph database.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
