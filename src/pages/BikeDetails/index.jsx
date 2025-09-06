import React from "react";
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
import { useBikeDetails } from "./hook/useBikeDetails";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";


const BikeDetails = () => {
    const {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteHandler,
        deleteBtnClickHandler,
        searchBikeDetailsHandler,
        handleChangePage,
        page,
        visibleRows,
        count,
        rights,
    } = useBikeDetails();

    const navigate = useNavigate();
    let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add Bike Details"}
                inputName="bike-details"
                navigatePath="/add-bike-details"
                callAPI={searchBikeDetailsHandler}
                addPermission={rights.add}
            />
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Bike Owner Name</TableCell>
                                <TableCell>City Name</TableCell>
                                <TableCell>Bike Name</TableCell>
                                <TableCell>Bike Number</TableCell>
                                <TableCell>Register Number</TableCell>
                                <TableCell>Register Date</TableCell>
                                <TableCell>Renew Date</TableCell>
                                <TableCell>Insurance Number</TableCell>
                                <TableCell>Insurance Date</TableCell>
                                <TableCell>Insurance Renew Date</TableCell>
                                {(rights.edit || rights.delete) && (
                                    <TableCell>Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.length ? (
                                visibleRows.map((row) => {
                                    return (
                                        <TableRow key={"bikedetails_" + row.id}>
                                            <TableCell width={25}>{(index += 1)}</TableCell>
                                            <TableCell width={200}>{row.bikeOwnerName}</TableCell>
                                            <TableCell width={125}>{row?.px_city?.name}</TableCell>
                                            <TableCell width={125}>{row.bikeName}</TableCell>
                                            <TableCell width={125}>{row.bikeNumber}</TableCell>
                                            <TableCell width={125}>{row.registerNumber}</TableCell>
                                            <TableCell width={125}>{row.registerDate}</TableCell>
                                            <TableCell width={125}>{row.renewDate}</TableCell>
                                            <TableCell width={125}>{row.insuranceNumber}</TableCell>
                                            <TableCell width={125}>{row.insuranceDate}</TableCell>
                                            <TableCell width={125}>{row.insuranceRenewDate}</TableCell>
                                            {(rights.edit || rights.delete) && (
                                                <TableCell width={50}>
                                                    <Box className="table-action-btn">
                                                        {(rights.edit && rights.delete) && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(`/view-bike-details/${row.id}`)
                                                                }
                                                            >
                                                                <FiEye size={15} />
                                                            </Button>
                                                        )}
                                                        {rights.edit && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(`/edit-bike-details/${row.id}`)
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
                                        No Bike Details Found
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
                    title="bikedetails"
                    deleteHandler={deleteHandler}
                />
            )}
        </>
    );
};

export default BikeDetails;
