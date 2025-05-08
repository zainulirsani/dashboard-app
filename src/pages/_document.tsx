import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        {/* Scrollbar Custom CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css"
        />
        {/* Bootstrap Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
        />
        {/* FontAwesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css"
        />

        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        />

        <Script
          src="https://kit.fontawesome.com/32f82e1dca.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        {/* jQuery */}
        <Script
          src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Bootstrap JavaScript */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive" // Load after page has been rendered
        />
      </body>
    </Html>
  );
}
