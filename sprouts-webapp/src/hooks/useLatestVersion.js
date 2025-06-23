import APIEndpoints from "APIEndpoints";
import { useEffect } from "react";
import semver from "semver";
import useResource from "./useResource";

const useLatestVersion = () => {
  const { data } = useResource(APIEndpoints.LATEST_COMPATIBLE_VERSION);
  useEffect(() => {
    if (data) {
      const isValid = semver.valid(data.version);
      if (isValid) {
        const clientVersion = process.env.NEXT_PUBLIC_NPM_VERSION;
        const isClientCompatible = semver.gte(
          clientVersion,
          data.version,
        );
        if (!isClientCompatible) {
          window.location.reload();
        }
      }
    }
  }, [data]);
};

export default useLatestVersion;
