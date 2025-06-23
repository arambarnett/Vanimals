import { useRouter } from "next/router";
import { useSession } from "store/Session";
import routes from "routes";

const useAuthHook = () => {
  const { isLoggedIn } = useSession();
  const router = useRouter();

  return () => {
    if (router.isReady) {
      if (isLoggedIn === false) {
        const { search, pathname } = window.location;
        router.replace({
          pathname: `${routes.SIGN_IN}`,
          query: {
            redirect: pathname + search,
          },
        });
      }
    }
  };
};

export default useAuthHook;
