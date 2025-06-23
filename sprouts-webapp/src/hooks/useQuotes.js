import { useContext } from "react";
import { QuoteContext } from "store/Quotes";

const useQuotes = () => useContext(QuoteContext);

export default useQuotes;
