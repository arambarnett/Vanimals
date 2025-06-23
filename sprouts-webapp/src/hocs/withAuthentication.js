import DefaultSkeleton from "components/DefaultSkeleton";
import LoginDialog from "components/Dialogs/LoginDialog";
import { useSession } from "store/Session";

const withAuthentication = (
  Component,
) => {
  const Skeleton = Component.Skeleton || DefaultSkeleton;

  const ProtectedRoute = (props) => {
    const { isLoggedIn } = useSession();

    if (isLoggedIn === null) return <Skeleton />;
    if (!isLoggedIn) return <LoginDialog />;
    return <Component {...props} />;
  };

  ProtectedRoute.Layout = Component.Layout;
  return ProtectedRoute;
};

export default withAuthentication;
