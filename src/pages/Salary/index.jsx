import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";

import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";

import useSalaryHooks from "./hooks/useSalary.hook";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const Salary = () => {
    const navigate = useNavigate();
    const {
        page,
        year,
        count,
        rights,
        month,
        isAdmin,
        branchList,
        visibleRows,
        isDeleteModalOpen,
        setYear,
        setMonth,
        download,
        searchList,
        deleteHandler,
        handleChangePage,
        setSelectedBranch,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
    } = useSalaryHooks();

    let index = page * 10;

    if(!isAdmin) {
        navigate('/add-salary')
    }

    return (
        <>
            <Box className="card">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="month">Select Month</InputLabel>
                            <Select 
                                size="small"
                                label="Select Month"
                                labelId="month"
                                value={month || ''}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <MenuItem value={1}>Jan</MenuItem>
                                <MenuItem value={2}>Feb</MenuItem>
                                <MenuItem value={3}>March</MenuItem>
                                <MenuItem value={4}>Apr</MenuItem>
                                <MenuItem value={5}>May</MenuItem>
                                <MenuItem value={6}>June</MenuItem>
                                <MenuItem value={7}>July</MenuItem>
                                <MenuItem value={8}>Aug</MenuItem>
                                <MenuItem value={9}>Sept</MenuItem>
                                <MenuItem value={10}>Oct</MenuItem>
                                <MenuItem value={11}>Nov</MenuItem>
                                <MenuItem value={12}>Dec</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <FormControl size="small" fullWidth>
                            <TextField
                                variant="outlined"
                                label="Year"
                                size="small"
                                name="year"
                                value={year}
                                onChange={(e) => {
                                    if(e.target.value.length < 5) {
                                        setYear(e.target.value);
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            id="userID"
                            disablePortal
                            // multiple
                            // isOptionEqualToValue={(option, value) => option?.id === value}
                            getOptionLabel={(option) => option.branchName ? option.branchName : ''}
                            options={branchList || []}
                            // value={branchList?.find((option) => option.id === selectedBranch) ?? ''}
                            onChange={(_event, value) => {
                                if(value) {
                                    setSelectedBranch(value)
                                } else {
                                    setSelectedBranch(null);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.branchName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Branch"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button fullWidth className="btn btn-tertiary" onClick={download}>Export</Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button fullWidth className="btn btn-tertiary" onClick={searchList}>Search</Button>
                    </Grid>
                </Grid>
            </Box>
            <br/>
            <TopBar
                btnTitle={"Add Salary"}
                inputName=""
                navigatePath="/add-salary"
                // callAPI={searchEmployeeTypeHandler}
                addPermission={rights.add}
            />

            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Working Days</TableCell>
                                <TableCell align="center">Week Off</TableCell>
                                <TableCell align="center">Month</TableCell>
                                <TableCell align="center">Year</TableCell>
                                {rights.edit && <TableCell>Status</TableCell>}
                                {(rights.edit || rights.delete) && (
                                    <TableCell>Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.length ? (
                                visibleRows.map((row) => {
                                    return (
                                        <TableRow key={"membership_plan_" + row.id}>
                                            <TableCell align="center">{(index += 1)}</TableCell>
                                            <TableCell align="center">{row.px_staff?.nickName}</TableCell>
                                            <TableCell align="center">{row.workingDays}</TableCell>
                                            <TableCell align="center">{row.weekOff}</TableCell>
                                            <TableCell align="center">{row.month}</TableCell>
                                            <TableCell align="center">{row.year}</TableCell>
                                            {rights.edit && (
                                                <TableCell>
                                                    <Switch
                                                        style={switchStyles}
                                                        checked={row.isActive}
                                                        onChange={(e) => changeStatusHandler(e, row.id)}
                                                    />
                                                </TableCell>
                                            )}
                                            {(rights.edit || rights.delete) && (
                                                <TableCell>
                                                    <Box className="table-action-btn">
                                                        {rights.edit && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(`/edit-salary/${row.id}`)
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
                                            )}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                                        No Salary Found
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

            <ConfirmationModal
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                title="Salary"
                deleteHandler={deleteHandler}
            />
        </>
    )
}

export default Salary;