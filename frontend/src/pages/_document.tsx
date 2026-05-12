//#region MODULES
import { Html, Head, Main, NextScript } from "next/document";
//#endregion

/**
 * @page Document
 * Documento HTML personalizado de Next.js.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="/runtime-config.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
