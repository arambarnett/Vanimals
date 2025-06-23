import { NextSeo } from "next-seo";

const createSeoInjector = (dataExtractor, handler) => (Component) => (props) => {
  const SEOHandler = handler || NextSeo;
  return (
    <>
      <SEOHandler {...dataExtractor(props)} />
      <Component {...props} />
    </>
  );
};

export default createSeoInjector;
