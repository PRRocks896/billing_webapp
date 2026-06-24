
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";

import Stack from "@mui/material/Stack";
import { Box1 } from "iconsax-reactjs";
import MainCard from "components/MainCard";

import UsePurchasedGiftCard from "./usePurchasedGiftCard";

const PurchasedGiftCard = () => {
    const {
        list,
        page,
        rows,
        order,
        rights,
        Column,
        orderBy,
        isVisible,
        totalCount,
        setPage,
        setRows,
        setOrder,
        setOrderBy,
        searchHandler,
        handleRequestSort,
    } = UsePurchasedGiftCard();

    const title = "Purchased Gift Card"

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <Box1 size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{title} Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View, manage, and configure all available employee wellness enquiries.
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
                    // buttonTitle={rights.add ? `Add New` : ""}
                    // handleBtn={handleAdd}
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
        </Stack>
    )
}
export default PurchasedGiftCard;