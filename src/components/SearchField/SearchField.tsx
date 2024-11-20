import React, { Dispatch, SetStateAction } from "react";
import {
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export function SearchField({ searchValue, setSearchValue }: Props) {
  return (
      <OutlinedInput
        value={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(event.target.value)
        }
        type="search"
        placeholder="Search by"
        startAdornment={
          <InputAdornment position="start"><SearchIcon /></InputAdornment>
        }
      />
  );
}
