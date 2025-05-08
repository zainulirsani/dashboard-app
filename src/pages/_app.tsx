import AppShell from '@/components/layouts/AppShell';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'daterangepicker/daterangepicker.css';
import { useRouter } from 'next/router';
import Head from 'next/head';


const disableAppShell = ["/auth/login"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = disableAppShell.includes(router.pathname);

  return (
    <>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>


      {/* Bootstrap Bundle JS */}
      

      {isAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      )}
    </>
  );
}
