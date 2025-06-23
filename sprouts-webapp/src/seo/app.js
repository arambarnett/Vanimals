import createSeoConfig from "./createSeoConfig";

const createDefaultSeoConfig = () => createSeoConfig({
  title: "Vanimals",
  description: "",
  images: [
    {
      url: "https://celebritydeathmatch.com/cdm-logo.png",
      width: 300,
      height: 300,
      alt: "logo",
    },
  ],
});

export default createDefaultSeoConfig;
