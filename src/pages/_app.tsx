// pages/_app.tsx

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Font Inter (Google Fonts via next/font)
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Global styles and third-party CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'daterangepicker/daterangepicker.css';
import '@/styles/globals.css';

// Layout
import AppShell from '@/components/layouts/AppShell';

// Routes that don't use the AppShell layout
const disableAppShell = ['/auth/login'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = disableAppShell.includes(router.pathname);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </Head>

      <main className={inter.className}>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <AppShell>
            <Component {...pageProps} />
          </AppShell>
        )}
      </main>
    </>
  );
}
