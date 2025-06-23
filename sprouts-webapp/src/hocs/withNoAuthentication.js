import DefaultSkeleton from "components/DefaultSkeleton";
import { useSession } from "store/Session";
import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "routes";

const withNoAuthentication = (Component) => {
  const ProtectedRoute = (props) => {
    const { isLoggedIn } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (router.isReady) {
        if (isLoggedIn === true && router.query?.type !== "link") {
          const { redirect } = router.query;
          const storedRedirect = localStorage.getItem("storedRedirect");
          localStorage.removeItem("storedRedirect");
          router.replace(redirect || storedRedirect || routes.INDEX);
        }
      }
    }, [isLoggedIn, router]);
  
    if (isLoggedIn === null) return <DefaultSkeleton />;
    return <Component {...props} />;
  };
  return ProtectedRoute;
};

export default withNoAuthentication;
