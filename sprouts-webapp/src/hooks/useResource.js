import useSWR from "swr";
import useHit from "./useHit";

const useResource = (endpoint, { options } = {}) => {
  const hit = useHit();
  const fetcher = (key) => hit(JSON.parse(key)).then((res) => {
    if (res && res.error) throw new Error(res.error);
    return res;
  });
  const key = JSON.stringify(endpoint);
  const { data, error, mutate } = useSWR(key, fetcher, options);
  return {
    data, error, loading: !data && !error, mutate,
  };
};

export default useResource;
