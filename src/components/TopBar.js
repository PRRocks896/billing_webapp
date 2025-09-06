import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { showToast } from "../utils/helper";

const TopBar = ({
  btnTitle,
  inputName,
  navigatePath,
  callAPI = () => { },
  addPermission = true,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  let location = useLocation();
  let pageTitle = "";

  if (location.pathname === "/") {
    pageTitle = "Home";
  } else if (location.pathname.includes("/")) {
    pageTitle = location.pathname.split("/")[1];
  }
  pageTitle = pageTitle.toUpperCase();

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
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="page-title"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '10px',
                display: { xs: 'block', sm: 'none' , lg: 'none' },


              }}
            >
              {pageTitle}
            </Typography>
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
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          '@media (max-width:425px)': {
                            display: 'flex',
                            marginRight: '50%'
                          },
                        }}
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
