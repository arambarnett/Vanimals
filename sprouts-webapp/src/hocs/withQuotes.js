import QuoteProvider from "store/Quotes";

/* eslint-disable react/display-name */
const withQuotes = (Component) => (props) => (
  <QuoteProvider>
    <Component {...props} />
  </QuoteProvider>
);

export default withQuotes;
