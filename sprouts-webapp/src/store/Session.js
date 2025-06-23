import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { parseJsonOrNull } from "utils";
import * as Sentry from "@sentry/nextjs";
import APIEndpoints from "APIEndpoints";

import hit from "hit";

export const SessionContext = createContext({
  loading: true,
  isLoggedIn: null,
  data: null,
  error: null,
  refresh: () => null,
  group: null,
  update: async () => null,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    data: null,
    error: null,
  });

  const refresh = async () => {
    const savedSession = parseJsonOrNull(localStorage.getItem("session"));
    if (savedSession) {
      const { error, ...data } = await hit(APIEndpoints.SESSION.REFRESH, null, {
        Authorization: savedSession.accessToken,
      });
      if (!error) {
        // setLanguage(data.languageId);
        localStorage.setItem("session", JSON.stringify(data));
        setSession({
          error: null,
          data,
        });
        Sentry.setUser({
          id: data.user.id,
          username: data.user.username,
        });
        return;
      }
      localStorage.removeItem("session");
    }
    setSession({
      error: true,
      data: null,
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const sessionLoading = useMemo(
    () => !session.error && !session.data,
    [session],
  );

  const activeSession = useMemo(() => ({
    ...session,
    loading: sessionLoading,
    refresh,
    isLoggedIn: sessionLoading ? null : !!session.data && !session.error,
  }));

  return (
    <SessionContext.Provider value={activeSession}>
      {children}
    </SessionContext.Provider>
  );
};

/* eslint-disable react/display-name */
export const withSession = (Component) => (props) => (
  <SessionProvider>
    <Component {...props} />
  </SessionProvider>
);
