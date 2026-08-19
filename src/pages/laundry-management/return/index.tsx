import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";

import UseReturn from "./hooks/useReturn";
import Stack from "@mui/material/Stack";
import { Import } from "iconsax-reactjs";
import MainCard from "components/MainCard";

const Return = () => {
    const {
        list,
        page,
        rows,
        rights,
        Column,
        totalCount,
        order,
        orderBy,
        handleRequestSort,
        setPage,
        setRows,
        handleAdd,
        searchHandler,
    } = UseReturn();

    const title = "Laundry Return"

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <Import size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Receive Items (Returns)</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Process incoming laundry using Challan codes and track damaged items.
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
                        buttonTitle={rights.add ? `Receive Items` : ""}
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
        </Stack>
    )
}

export default Return;
