import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Scanner } from 'iconsax-reactjs';

import MainCard from 'components/MainCard';
import DynamicTable from 'components/DynamicTable';
import SearchContainer from 'components/SearchContainer';

import FaceCaptureDialog from './component/FaceCaptureDialog';
import UseFaceRecognition from './hooks/useFaceRecognition';

const FaceRecognition = () => {
  const {
    list,
    page,
    rows,
    Column,
    totalCount,
    order,
    orderBy,
    dialog,
    location,
    fetch,
    setPage,
    setRows,
    closeDialog,
    searchHandler,
    handleRequestSort
  } = UseFaceRecognition();

  return (
    <Stack spacing={3}>
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
          <Scanner size={28} variant="Bulk" />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Face Recognition
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register a staff member's face once, then mark attendance with a quick face scan.
          </Typography>
        </Box>
      </Stack>

      {/* ── Staff list ────────────────────────────────────────────────────────── */}
      <MainCard content={false}>
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: 1, borderColor: 'divider' }}>
          <SearchContainer isSearchable={true} handleSearchText={searchHandler} />
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

      {/* ── Register / attendance modal ───────────────────────────────────────── */}
      <FaceCaptureDialog
        open={!!dialog}
        mode={dialog?.mode ?? 'attendance'}
        staff={dialog?.staff ?? null}
        location={location}
        onClose={closeDialog}
        onDone={fetch}
      />
    </Stack>
  );
};

export default FaceRecognition;
