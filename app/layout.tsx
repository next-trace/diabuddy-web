import type { Metadata } from 'next';
import '@next-trace/nexdoz-design-system/styles.css';
import './globals.css';
import { AppShell } from './components/app-shell';
import { LanguageProvider } from './components/language';

export const metadata: Metadata = {
  title: 'Nexdoz',
  description: 'Diabetes care companion'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dbui-light" dir="ltr">
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
