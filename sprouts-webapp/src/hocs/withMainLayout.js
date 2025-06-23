import MainLayout from "layouts/MainLayout";

/* eslint-disable no-param-reassign */
const withMainLayout = (Screen) => {
  Screen.Layout = MainLayout;
  return Screen;
};

export default withMainLayout;
