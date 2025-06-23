import React, { useRef } from "react";

const SelectFile = ({ onChange, children, ...rest }) => {
  const fileBox = useRef();

  const onChangeFile = async () => {
    const file = document.getElementById("file").files[0];
    onChange(file);
  };

  const hookedChildren = React.cloneElement(children, {
    style: { cursor: "pointer" },
    onClick: () => fileBox.current.click(),
  });

  return (
    <>
      {hookedChildren}
      <input
        type="file"
        id="file"
        ref={fileBox}
        style={{ display: "none" }}
        onChange={onChangeFile}
        {...rest}
      />
    </>
  );
};

export default SelectFile;
