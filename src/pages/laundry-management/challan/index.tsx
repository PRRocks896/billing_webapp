import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";
import CustomDailogBox from "components/CustomDailogBox";

import UseChallan from "./hooks/useChallan";
import Stack from "@mui/material/Stack";
import { DocumentText } from "iconsax-reactjs";
import MainCard from "components/MainCard";

const Challan = () => {
    const {
        list,
        page,
        rows,
        rights,
        Column,
        isVisible,
        totalCount,
        order,
        orderBy,
        handleRequestSort,
        setPage,
        setRows,
        handleAdd,
        searchHandler,
        onCancelHandler,
        closeConfirmModal
    } = UseChallan();

    const title = "Laundry Challan"

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <DocumentText size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Send Items (Challans)</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create and manage challans for sending items to laundry vendors.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {/* ── Main Content Area ─────────────────────────────────────────────────── */}
            <MainCard content={false}>
                <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: 1, borderColor: 'divider' }}>
                    <SearchContainer
                        isSearchable={true}
                        handleSearchText={searchHandler}
                        buttonTitle={rights.add ? `Send New Items` : ""}
                        handleBtn={handleAdd}
                    />
                </Box>

                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DynamicTable
                        title=""
                        data={list}
                        columns={Column}
                        totalCount={totalCount}
                        page={page}
                        rowsPerPage={rows}
                        order={order}
                        orderBy={orderBy}
                        handleRequestSort={handleRequestSort}
                        handleChangePage={(_, newPage) => setPage(newPage)}
                        handleChangeRowsPerPage={(e) => setRows(Number(e.target.value))}
                    />
                </Box>
            </MainCard>

            {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
            {isVisible && (
                <CustomDailogBox
                    open={isVisible}
                    title={`Cancel Challan`}
                    description={`Are you sure you want to cancel this challan? Stock will be reversed. This action cannot be undone.`}
                    btnText1="Close"
                    btnText2="Confirm Cancel"
                    isError={true}
                    handleClose={closeConfirmModal}
                    handleSubmit={onCancelHandler}
                />
            )}
        </Stack>
    )
}

export default Challan;
