import type { Metadata } from 'next';
import '@next-trace/diabuddy-design-system/styles.css';
import './globals.css';
import { AppShell } from './components/app-shell';
import { LanguageProvider } from './components/language';

export const metadata: Metadata = {
  title: 'DiaBuddy',
  description: 'Diabetes care companion',
  icons: {
    icon: '/brand-icon-v2.svg?v=20260422c',
    shortcut: '/brand-icon-v2.svg?v=20260422c',
    apple: '/brand-icon-v2.svg?v=20260422c'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="core" dir="ltr">
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
