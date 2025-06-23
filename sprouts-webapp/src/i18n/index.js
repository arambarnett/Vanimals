import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// import { getBrowserLanguageNumber } from "utils";
import es from "./locales/es.json";
import en from "./locales/en.json";

const mapCodeToDictionary = {
  1: es,
  0: en,
};
const I18nContext = createContext({
  t: () => {},
  language: "",
  setLanguage: () => {},
});

export const useTranslation = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  // const defaultLanguage = getBrowserLanguageNumber();
  const defaultLanguage = 0; // espaniol
  const [language, setLanguage] = useState(defaultLanguage);
  const t = useCallback((key) => mapCodeToDictionary[language][key], [language]);
  const context = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  useEffect(() => {
  }, [language]);

  return (
    <I18nContext.Provider value={context}>
      {children}
    </I18nContext.Provider>
  );
};

/* eslint-disable-next-line react/display-name */
export const withI18n = (Component) => (props) => (
  <I18nProvider>
    <Component {...props} />
  </I18nProvider>
);
