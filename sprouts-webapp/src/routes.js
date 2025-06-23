module.exports = {
  CALLBACK_FACEBOOK: "/cb/facebook",
  CALLBACK_GOOGLE: "/cb/google",
  CALLBACK_METAMASK: "/cb/metamask",
  INDEX: "/",
  HOME: "/",
  SIGN_IN: "/sign-in",
  VANIMALS: "/vanimals",
  STORE: "/store",
  FAQ: "/faq",
  STORE_DETAIL: "/store/:eggs",
  COLLECTION: {
    MY_VANIMALS: "/collection/my-vanimals",
    MY_EGGS: "/collection/my-eggs",
    USER_VANIMALS: (blockchainAddress) => `/collection/my-vanimals/${blockchainAddress}`,
  },
  BREED_VANIMALS: "/breed-vanimals",
  MARKETPLACE: "Marketplace",
};
