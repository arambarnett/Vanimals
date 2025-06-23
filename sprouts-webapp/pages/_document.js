/* eslint-disable react/no-danger */
import React from "react";
import Document, { Head, Main, NextScript, Html } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es" translate="no">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          {process.env.NEXT_PUBLIC_ENABLE_GA === "true" && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-R8VDHWXHNE"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-R8VDHWXHNE');
                `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>,
    ],
  };
};

export default MyDocument;
