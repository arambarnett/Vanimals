import APIEndpoints from "APIEndpoints";
import useHit from "hooks/useHit";
import { uploadFileToS3 } from "utils";
import SelectFile from "./SelectFile";

const SelectImage = ({ children, onChange, onLoading }) => {
  const hit = useHit();

  const onChangeFile = async (file) => {
    if (onLoading) onLoading();
    const { preSignedUrl, error: preSignError } = await hit(APIEndpoints.PRESIGN_URL);
    if (preSignError) {
      alert("Error uploading image");
      return;
    }
    const { error } = await uploadFileToS3(preSignedUrl, file);
    if (error) {
      alert("Error uploading image");
      return;
    }
    const assetUrl = preSignedUrl.substring(0, preSignedUrl.indexOf("?"));
    onChange(assetUrl);
  };

  return (
    <SelectFile
      accept="image/gif, image/jpeg, image/png"
      onChange={onChangeFile}
    >
      {children}
    </SelectFile>
  );
};

export default SelectImage;
