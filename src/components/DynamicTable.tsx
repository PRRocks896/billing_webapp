import { ChangeEvent } from 'react';

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

// project-imports
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';

// types
import { HeadCell, EnhancedTableHeadProps, ArrangementOrder } from 'types/table';

// ==============================|| DYNAMIC TABLE - HEAD ||============================== //

interface DynamicTableHeadProps extends Omit<EnhancedTableHeadProps, 'onSelectAllClick' | 'numSelected' | 'rowCount'> {
    headCells: HeadCell[];
}

function EnhancedTableHead({
    headCells,
    order,
    orderBy,
    onRequestSort
}: DynamicTableHeadProps) {
    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => {
                    const isSortable = headCell.isSortable || headCell.sortable;
                    return (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
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
}

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
    handleRequestSort
}: DynamicTableProps) {
    return (
        <MainCard
            content={false}
            title={title}
        // secondary={<CSVExport data={data} headers={columns} filename={`${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`} />}
        >
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        headCells={columns}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort || (() => { })}
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
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.id}
                                            align={col.align || (col.numeric ? 'right' : 'left')}
                                            padding={col.disablePadding ? 'none' : 'normal'}
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
            <Divider />
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
}
