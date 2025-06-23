import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
  
const useLeavePrevention = (message) => {
  const router = useRouter();
  const permissionToLeave = useRef(false);

  const handleWindowClose = useCallback((e) => {
    e.preventDefault();
    return e.returnValue = message;
  }, []);

  const handleRouteChange = useCallback(() => {
    if (permissionToLeave.current) return;
    if (window.confirm(message)) {
      permissionToLeave.current = true;
    } else {
      router.events.emit("routeChangeError");
      /* eslint-disable-next-line no-throw-literal */
      throw "CANCELLED_NAVIGATION";
    }
  }, []);

  const removeListeners = useCallback(() => {
    router.events.off("routeChangeStart", handleRouteChange);
    window.removeEventListener("beforeunload", handleWindowClose);
  }, [handleRouteChange, handleWindowClose]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleRouteChange);
    return removeListeners;
  }, []);

  return {
    turnOff: removeListeners,
  };
};

export default useLeavePrevention;
