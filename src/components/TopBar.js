import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
} from "@mui/material";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { showToast } from "../utils/helper";

const TopBar = ({
  btnTitle,
  inputName,
  navigatePath,
  callAPI = () => {},
  addPermission = true,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = debounce(async (payload) => {
    try {
      callAPI(payload);
    } catch (error) {
      showToast(error.message, false);
    }
  }, 500);

  const searchValueHandler = (e) => {
    if (e.target.value.length === 0 || e.target.value.length > 3) {
      const payload = { searchValue: e.target.value.toUpperCase() };
      debouncedSearch(payload);
    }
  };

  return (
    <>
      {/* top page action with text */}
      <Box className="top-bar">
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            {inputName && inputName.length > 0 &&
            <Box className="search-box">
              <InputBase
                name={`${inputName}`}
                placeholder={`Search ${inputName}`}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value.toUpperCase());
                  searchValueHandler(e);
                }}
                endAdornment={
                  <InputAdornment
                    position="end"
                    className="end-input-icon text-grey"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <FiSearch />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>}
          </Grid>
          {addPermission && (
            <Grid item>
              <Button
                component={"button"}
                className="btn btn-tertiary"
                onClick={() => navigate(navigatePath)}
              >
                <FiPlus /> &nbsp; <p>{btnTitle}</p>
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default TopBar;
