import { useSession } from "store/Session";
import hit from "hit";

const useHit = ({ accessToken } = {}) => {
  const { data } = useSession();
  return (endpoint, body, headers) => hit(
    endpoint,
    body,
    {
      ...(data && { Authorization: data.accessToken }),
      ...(accessToken && { Authorization: accessToken }),
      ...headers,
    },
  );
};

export default useHit;
