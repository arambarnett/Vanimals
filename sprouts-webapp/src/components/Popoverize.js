import Menu from "@material-ui/core/Menu";
import { useState, cloneElement } from "react";

const Popoverize = ({ children, options, MenuProps, ...rest }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const togglePopUp = (e) => setMenuAnchor(menuAnchor ? null : e.currentTarget);
  const newChildren = cloneElement(children, { onClick: togglePopUp, ...rest });
  
  return (
    <>
      {newChildren}
      <Menu
        onClick={togglePopUp}
        id="menu-appbar"
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={togglePopUp}
        {...MenuProps}
      >
        {options}
      </Menu>
    </>
  );
};

export default Popoverize;
