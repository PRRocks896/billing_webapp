import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import * as moment from "moment";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch"
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
import useDailyReportHooks from "./hooks/useDailyReport.hooks";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};


const DailyReport = () => {
    const navigate = useNavigate();
    const {
        page,
        count,
        rights,
        isAdmin,
        dateRange,
        branchList,
        visibleRows,
        isDeleteModalOpen,
        setDateRange,
        deleteHandler,
        downloadReport,
        handleChangePage,
        setSelectedBranch,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchDailyReportHandler,
    } = useDailyReportHooks();

    if(!isAdmin) {
        navigate('/add-daily-report')
    }

    return (
        <>
            {isAdmin ?
                <Box className="card">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <TextField
                                    size="small"
                                    type="date"
                                    label="Select Date"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
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
                        <Grid item xs={12} sm={3}>
                            <Button fullWidth className="btn btn-tertiary" onClick={downloadReport}>Export</Button>
                        </Grid>
                    </Grid>
                </Box>
            : null}
            <br/>
            <TopBar
                btnTitle={"Add Daily Report"}
                inputName="dailyReport"
                navigatePath="/add-daily-report"
                callAPI={searchDailyReportHandler}
                addPermission={rights.add}
            />
            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Date</TableCell>
                                {isAdmin && <TableCell>Branch Name</TableCell>}
                                <TableCell>Staff Present</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Expense</TableCell>
                                {rights.edit && <TableCell>Status</TableCell>}
                                {(rights.edit || rights.delete) && (
                                    <TableCell>Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.length ? (
                                visibleRows.map((row, index) => {
                                    return (
                                        <TableRow key={"daily_report" + row.id}>
                                            <TableCell align="left">{(index += 1)}</TableCell>
                                            <TableCell align="left">{moment(row.dailyReportDate).format('DD/MM/yyyy')}</TableCell>
                                            {isAdmin && <TableCell>{row.px_user?.lastName}</TableCell>}
                                            <TableCell align="left">{row.totalStaffPresent}</TableCell>
                                            <TableCell align="left">{row.totalCustomer}</TableCell>
                                            <TableCell align="left">{row.totalExpenses}</TableCell>
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
                                                                    navigate(`/edit-daily-report/${row.id}`)
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
                                        No Daily Report Found
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
                title="Daily Report"
                deleteHandler={deleteHandler}
            />
        </>
    )
}

export default DailyReport;