import APIEndpoints from "APIEndpoints";
import useResource from "./useResource";

const useExchangeRate = () => useResource(APIEndpoints.EXCHANGE_RATE.GET);

export default useExchangeRate;
