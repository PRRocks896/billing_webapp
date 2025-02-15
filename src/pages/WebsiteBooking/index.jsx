import React from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TopBar from "../../components/TopBar";
import useWebsiteBookingHook from "./hook/useWebsiteBooking.hook";

const WebsiteBooking = () => {
    const {
        page,
        count,
        isAdmin,
        visibleRows,
        handleChangePage,
        searchWebsiteBookingHandler,
    } = useWebsiteBookingHook();
    return (
        <>
            <TopBar
                // btnTitle={"Add SEO"}
                inputName="Website Booking"
                // navigatePath="/add-seo"
                callAPI={searchWebsiteBookingHandler}
                addPermission={false}
            />
            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {isAdmin && <TableCell>Branch Name</TableCell>}
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Coupon</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.length ? (
                                visibleRows.map((row) => {
                                    return (
                                        <TableRow key={"membership_" + row.id}>
                                            {isAdmin && <TableCell align="left">{row.px_user?.branchName || 'N/A'}</TableCell>}
                                            <TableCell align="left">{row.px_customer?.name || 'N/A'}</TableCell>
                                            <TableCell align="left">{row.px_service?.name || 'N/A'}</TableCell>
                                            <TableCell align="left">{moment(row.dateTime).format('DD/MM/yyyy hh:mm A') || 'N/A'}</TableCell>
                                            {isAdmin && <TableCell align="left">{row.grandTotal || 'N/A'}/-</TableCell>}
                                            <TableCell align="left">{row.cupon?.name || 'N/A'}</TableCell>
                                            <TableCell align="left">{row.status}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                                        No Website Booking Found
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
        </>
    )
}

export default WebsiteBooking;