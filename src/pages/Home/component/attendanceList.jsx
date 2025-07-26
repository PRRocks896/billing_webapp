import React from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import { useAttendanceListHomePage } from "../hook/useAttendanceListHomepage";
import 'rsuite/dist/rsuite.min.css';


const AttendanceList = ({ attendanceData = [], onRefresh }) => {
    const {
        staffList,
        refreshList: fetchAttendanceList,
    } = useAttendanceListHomePage();

    return (
        <>
            <Box className="card">
                <Box className="activity-card-wrapper mb-24">
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={fetchAttendanceList}>Refresh</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <br />
                        <TableContainer className="table-wrapper" sx={{ height: '350px'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Staff Name</TableCell>
                                        <TableCell>Time In</TableCell>
                                        <TableCell>Time Out</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {staffList?.length > 0 ? (
                                        staffList.map((data, index) => (
                                            <TableRow key={data.value || index}>
                                                <TableCell>{(index + 1)}</TableCell>
                                                <TableCell>{data.label}</TableCell>
                                                <TableCell>{data.inTime}</TableCell>
                                                <TableCell>{data.outTime}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default AttendanceList;
