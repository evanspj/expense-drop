import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#ffffff" />
          <meta content="A privacy-focused way to review your expenses." />
          <meta property="og:url" content="https://expense-drop.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Expense Drop" />
          <meta
            property="og:description"
            content="A privacy-focused way to review your expenses. All file processing and data stays in your browser. No data is stored on a server. Your important financial data should be for your eyes only."
          />
          <meta property="og:title" content="Expense Drop" />
          <meta
            property="og:image"
            content="https://expense-drop.vercel.app/expense_drop_social_share-optimized.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@_evanspj" />
          <meta name="twitter:title" content="Expense Drop" />
          <meta
            name="twitter:description"
            content="A privacy-focused way to review your expenses. All file processing and data stays in your browser. No data is stored on a server. Your important financial data should be for your eyes only."
          />
          <meta
            name="twitter:image"
            content="https://expense-drop.vercel.app/expense_drop_social_share-optimized.png"
          />
        </Head>
        <body className="w-full flex bg-gray-100 text-gray-800 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
