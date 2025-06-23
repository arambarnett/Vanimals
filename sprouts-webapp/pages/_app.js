/* eslint-disable react/no-danger */
import Router from "next/router";
import { useEffect } from "react";

import { withBlockchain } from "store/Blockchain";
import { withSession } from "store/Session";

import TransparentLayout from "layouts/TransparentLayout";
import useLatestVersion from "hooks/useLatestVersion";

import createSeoInjector from "hocs/createSeoInjector";
import withQuotes from "hocs/withQuotes";
import withDialogs from "hocs/withDialogs";
import withToasts from "hocs/withToasts";

import createDefaultSeoConfig from "seo/app";
import { DefaultSeo } from "next-seo";
import { withTheme } from "theme";
import NProgress from "nprogress";
import { withI18n } from "i18n";

import "nprogress/nprogress.css";
import "global.css";

// styles for carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeError", () => NProgress.done());
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
  const next = document.querySelector("#__next");
  next.scrollTo(0, 0);
});

const App = ({ Component, pageProps }) => {
  useLatestVersion();

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentNode.removeChild(jssStyles);
  }, []);

  const Layout = Component.Layout || TransparentLayout;

  return (
    <>
      <meta
        name="viewport"
        content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi"
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

const withSeo = createSeoInjector(createDefaultSeoConfig, DefaultSeo);

const hocs = [
  withQuotes,
  withDialogs,
  withToasts,
  withTheme,
  withI18n,
  withBlockchain,
  withSession,
  withSeo,
];

const wrappedApp = hocs.reduce((app, wrapper) => wrapper(app), App);

export default wrappedApp;
