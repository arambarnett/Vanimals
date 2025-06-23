const FacebookIcon = (props) => {
  const { styles } = props;

  return (
    <svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styles}
      {...props}
    >
      <path
        d="M23 .096c-12.702 0-23 10.297-23 23C0 34.489 8.292 43.923 19.164 45.75V27.894h-5.548V21.47h5.548V16.73c0-5.497 3.358-8.493 8.263-8.493 2.349 0 4.368.175 4.954.252v5.747l-3.402.001c-2.667 0-3.181 1.267-3.181 3.127v4.101h6.363l-.83 6.426h-5.533v18.013C37.178 44.52 46 34.844 46 23.09 46 10.393 35.702.096 23 .096z"
        fill="#fff"
      />
    </svg>
  );
};

export default FacebookIcon;
