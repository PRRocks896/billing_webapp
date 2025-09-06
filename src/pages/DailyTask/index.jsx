import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { FiEdit3, FiTrash2, FiEye } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useDailyTask } from "./hook/useDailyTask";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DailyTask = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchDailyTaskHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useDailyTask();

  const StatusMenuCell = ({ row, addTaskHandler }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleSelect = (status) => {
      changeStatusHandler({ target: { value: status } }, Number(row.id));
      handleClose();
    };

    return (
      <TableCell width={125}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {["Assign", "Pending", "Working", "Completed"].map((status) => (
            <MenuItem key={status} onClick={() => handleSelect(status)}>
              {status}
            </MenuItem>
          ))}
        </Menu>
      </TableCell>
    );
  };

  const NoteCell = ({ note }) => {
    const [expanded, setExpanded] = useState(false);
    const handleClick = () => {
      setExpanded(!expanded);
    };
    const displayText = expanded ? note : note.length > 4 ? note.substring(0, 4) + "..." : note;
    return (
      <TableCell width={120} onClick={handleClick} style={{ cursor: "pointer" }}>
        {displayText}
      </TableCell>
    );
  };

  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle={"Add Daily Task"}
        inputName="daily-task"
        navigatePath="/add-daily-task"
        callAPI={searchDailyTaskHandler}
        addPermission={rights.add}
      />

      {/* staff listing */}
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Branch Name</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Status</TableCell>
                {(rights.edit || rights.delete) && (
                  <TableCell>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length ? (
                visibleRows.map((row) => {
                  return (
                    <TableRow key={"staff_" + row.id}>
                      <TableCell width={25}>{(index += 1)}</TableCell>
                      <TableCell width={200}>{row.px_user.branchName}</TableCell>
                      <TableCell width={125}>{row.supervisormanager?.nickName}</TableCell>
                      <NoteCell note={row.note} />
                      <TableCell width={125}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                          <span>{row.status}</span>
                          <StatusMenuCell row={row} changeStatusHandler={changeStatusHandler} />
                        </Box>
                      </TableCell>
                      <TableCell width={50}>
                        <Box className="table-action-btn">
                          {(rights.edit && rights.delete) && (
                            <Button
                              className="btn btn-primary"
                              onClick={() =>
                                navigate(`/view-daily-task/${row.id}`)
                              }
                            >
                              <FiEye size={15} />
                            </Button>
                          )}
                          {rights.edit && (
                            <Button
                              className="btn btn-primary"
                              onClick={() =>
                                navigate(`/edit-daily-task/${row.id}`)
                              }
                            >
                              <FiEdit3 size={15} />
                            </Button>
                          )}
                          {rights.delete && (
                            <Button
                              className="btn btn-primary"
                              onClick={deleteBtnClickHandler.bind(
                                null,
                                row.id
                              )}
                            >
                              <FiTrash2 size={15} />
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                      {/* )} */}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                    No staff Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={count}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Box>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          title="staff"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default DailyTask;
