const createSeoConfig = ({
  title,
  description,
  images,
  ...rest
}) => ({
  title,
  titleTemplate: "Vanimals",
  description,
  canonical: "",
  openGraph: {
    url: "",
    title,
    description,
    images,
    site_name: "Vanimals",
  },
  ...rest,
});

export default createSeoConfig;
