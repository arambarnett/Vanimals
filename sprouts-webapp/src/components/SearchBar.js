import { TextField, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";
import { useRef } from "react";

const SearchBar = (props) => {
  const inputRef = useRef();
  const router = useRouter();
  const { t } = useTranslation();

  const onSearch = (e) => {
    if (e) e.preventDefault();
    router.push(`/search?query=${inputRef.current.value}`);
  };

  return (
    <form onSubmit={onSearch}>
      <TextField
        placeholder={t("SEARCH")}
        inputRef={inputRef}
        size="small"
        InputProps={{
          style: {
            borderRadius: 25,
          },
          endAdornment: (
            <IconButton onClick={onSearch}>
              <Search />
            </IconButton>
          ),
        }}
        {...props}
      />
    </form>
  );
};

export default SearchBar;
