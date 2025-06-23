import SplashError from "components/SplashError";
import { useTranslation } from "i18n";

const Custom404 = () => {
  const { t } = useTranslation();
  return <SplashError label={`404 - ${t("PAGE_NOT_FOUND")}`} />;
};

export default Custom404;
