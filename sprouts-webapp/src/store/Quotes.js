import { createContext } from "react";
import APIEndpoints from "APIEndpoints";
import { useResource } from "hooks";

export const QuoteContext = createContext({});

const QuoteProvider = ({ children }) => {
  const quote = useResource(
    APIEndpoints.EXCHANGE_RATE,
    {
      options: {
        revalidateOnFocus: false,
        refreshInterval: 90000, // 90 secs
      },
    },
  );

  return (
    <QuoteContext.Provider value={quote}>
      {children}
    </QuoteContext.Provider>
  );
};

export default QuoteProvider;
