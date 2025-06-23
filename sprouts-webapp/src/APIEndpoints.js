const APIEndpoints = Object.freeze({
  PRESIGN_URL: { method: "POST", url: "/assets/pre-signed-urls" },
  USER: {
    GET_BALANCE: (address) => ({ method: "GET", url: `/users/me/balance/${address}` }),
    BY_ID: (userId) => ({ method: "GET", url: `/users/${userId}` }),
    UPDATE: { method: "PATCH", url: "/users/me" },
    DELETE: { method: "DELETE", url: "/users/me" },
    LINK_AUTH_METHOD: { method: "POST", url: "/users/me/authentication-methods" },
  },
  SESSION: {
    REFRESH: { method: "POST", url: "/sessions/tokens" },
    GET: (token) => ({ method: "get", url: `/sessions/${token}` }),
    CREATE: {
      CHALLENGE: {
        method: "POST",
        url: "/sessions/signature-challenges",
      },
      WITH_GOOGLE: {
        method: "POST",
        url: "/sessions/google",
      },
      WITH_METAMASK: {
        method: "POST",
        url: "/sessions/metamask",
      },
      WITH_FACEBOOK: {
        method: "POST",
        url: "/sessions/facebook",
      },
    },
  },
  COLLECTION: {
    GET: (params) => {
      const urlparams = new URLSearchParams(params).toString();
      return {
        method: "GET",
        url: `/vanimals/collections?${urlparams}`,
      };
    },
    HATCHING: {
      method: "POST",
      url: "/hatch",
    },
    HATCHING_OPEN: {
      method: "PUT",
      url: "/hatch",
    },
  },
  STORE: {
    PAYMENT: {
      CKB_TRANSACTION: ({
        method: "POST",
        url: "/buy-egg",
      }),
      CKB_TRANSACTION_HASH: ({
        method: "PUT",
        url: "/buy-egg",
      }),
    },
  },
});

export default APIEndpoints;
