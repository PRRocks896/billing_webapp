import { ChangeEvent, Fragment } from 'react';

// material-ui
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';

// types
import { HeadCell, EnhancedTableHeadProps, ArrangementOrder } from 'types/table';

// ==============================|| DYNAMIC TABLE - HEAD ||============================== //

interface DynamicTableHeadProps extends Omit<EnhancedTableHeadProps, 'onSelectAllClick' | 'numSelected' | 'rowCount'> {
    headCells: HeadCell[];
    stickyFirstColumn?: boolean;
}

// first column stays visible while the rest scrolls sideways (opt-in via `stickyFirstColumn`)
const stickyCellSx = (isFirst: boolean, enabled: boolean, background: string) =>
    enabled && isFirst ? { position: 'sticky', left: 0, zIndex: 2, bgcolor: background } : undefined;

function EnhancedTableHead({
    headCells,
    order,
    orderBy,
    onRequestSort,
    stickyFirstColumn = false
}: DynamicTableHeadProps) {
    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, headIndex) => {
                    const isSortable = headCell.isSortable || headCell.sortable;
                    return (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={stickyCellSx(headIndex === 0, stickyFirstColumn, 'secondary.lighter')}
                        >
                            {isSortable ? (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                headCell.label
                            )}
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| DYNAMIC TABLE ||============================== //

interface DynamicTableProps {
    title?: string;
    data: any[];
    columns: HeadCell[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
    order?: ArrangementOrder;
    orderBy?: string;
    handleRequestSort?: (event: any, property: string) => void;
    /**
     * Below 600px: `'scroll'` (default) keeps the table and scrolls sideways; `'cards'` shows one card per row.
     * Card roles come from `HeadCell.mobile` (default: first column = title, `actions` column = action row).
     */
    mobileLayout?: 'scroll' | 'cards';
    /** Keep the first column visible while scrolling sideways. Default false. */
    stickyFirstColumn?: boolean;
    /** Minimum table width in px before it scrolls sideways. Default 750. */
    minWidth?: number;
}

const isActionsColumn = (col: HeadCell) => col.mobile === 'actions' || (col.mobile === undefined && /^actions?$/i.test(col.id));

const cellValue = (col: HeadCell, row: any) => {
    if (col.renderCell) return col.renderCell(row);
    const value = row[col.id];
    return value === null || value === undefined || value === '' ? '-' : value;
};

export default function DynamicTable({
    title = 'Table',
    data,
    columns,
    totalCount,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    order,
    orderBy,
    handleRequestSort,
    mobileLayout = 'scroll',
    stickyFirstColumn = false,
    minWidth = 750
}: DynamicTableProps) {
    const theme = useTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
    const showCards = mobileLayout === 'cards' && isPhone;

    // card roles (only used when showCards)
    const cardColumns = columns.filter((col) => col.mobile !== 'hidden');
    const actionsColumn = cardColumns.find(isActionsColumn);
    const primaryColumn = cardColumns.find((col) => col.mobile === 'primary') ?? cardColumns.find((col) => !isActionsColumn(col));
    const bodyColumns = cardColumns.filter((col) => col !== actionsColumn && col !== primaryColumn);

    return (
        <MainCard
            content={false}
            title={title}
        // secondary={<CSVExport data={data} headers={columns} filename={`${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`} />}
        >
            {showCards ? (
                <Stack spacing={1.5} sx={{ p: 1.5 }}>
                    {data.map((row, index) => (
                        <Box
                            key={row.id || row.name || index}
                            sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}
                        >
                            {primaryColumn && (
                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, mb: 1, wordBreak: 'break-word' }}>
                                    {cellValue(primaryColumn, row)}
                                </Typography>
                            )}
                            <Box
                                component="dl"
                                sx={{ m: 0, display: 'grid', gridTemplateColumns: 'minmax(88px, 38%) minmax(0, 1fr)', columnGap: 2, rowGap: 1 }}
                            >
                                {bodyColumns.map((col) => (
                                    <Fragment key={col.id}>
                                        <Typography component="dt" variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                            {col.label}
                                        </Typography>
                                        <Box component="dd" sx={{ m: 0, minWidth: 0, wordBreak: 'break-word' }}>
                                            {cellValue(col, row)}
                                        </Box>
                                    </Fragment>
                                ))}
                            </Box>
                            {actionsColumn && (
                                <>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        {cellValue(actionsColumn, row)}
                                    </Box>
                                </>
                            )}
                        </Box>
                    ))}
                </Stack>
            ) : (
            <TableContainer>
                <Table sx={{ minWidth }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        headCells={columns}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort || (() => { })}
                        stickyFirstColumn={stickyFirstColumn}
                    />
                    <TableBody>
                        {data.map((row, index) => {
                            // Assuming the first column is the ID or unique key, usually 'id' or 'name' in your example
                            const rowId = row.id || row.name || index;

                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={rowId}
                                >
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={col.id}
                                            align={col.align || (col.numeric ? 'right' : 'left')}
                                            padding={col.disablePadding ? 'none' : 'normal'}
                                            sx={stickyCellSx(colIndex === 0, stickyFirstColumn, 'background.paper')}
                                        // sortDirection={col.isSortable ? 'asc' : 'desc'}
                                        >
                                            {col.renderCell ? col.renderCell(row) : row[col.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
            <Divider />
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                {...(showCards && {
                    sx: { '& .MuiTablePagination-selectLabel, & .MuiTablePagination-input': { display: 'none' }, '& .MuiTablePagination-toolbar': { pl: 1 } }
                })}
            />
        </MainCard>
    );
}
