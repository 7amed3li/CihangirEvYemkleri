import type { Metadata } from 'next';
import './globals.css';
import './overrides.css';

export const metadata: Metadata = {
  title: 'Cihangir — Sofra kurulsun',
  description: 'Cihangir’in kalbinde ev yemekleri ve taş fırın pide. Bugün sofrada ne var?',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
