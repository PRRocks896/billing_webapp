import React from "react";
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

const TopBar = ({ btnTitle, inputName, navigatePath }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* top page action with text */}
      <Box className="top-bar">
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            <Box className="search-box">
              <InputBase
                name={`${inputName}`}
                placeholder={`Search ${inputName}`}
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
            </Box>
          </Grid>

          <Grid item>
            <Button
              component={"button"}
              className="btn btn-tertiary"
              onClick={() => navigate(navigatePath)}
            >
              <FiPlus /> &nbsp; <p>{btnTitle}</p>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TopBar;
