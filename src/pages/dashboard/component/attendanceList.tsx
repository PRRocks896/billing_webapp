// material-ui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Refresh } from 'iconsax-reactjs';

// project-imports
import MainCard from 'components/MainCard';

// types
import { ColorProps } from 'types/extended';

// table data
const createData = (badgeText: string, badgeType: string, subject: string, dept: string, date: string) => ({
    badgeText,
    badgeType,
    subject,
    dept,
    date
});

import UseAttendanceList from "../hooks/useAttendanceList";

const AttendanceList = ({ companyID = null }: { companyID?: number | null }) => {
    const {
        staffList,
        fetchAttendanceList
    } = UseAttendanceList(companyID);

    return (
        <MainCard
            title="Today's Attendance"
            content={false}
            secondary={
                <IconButton color="primary" onClick={() => fetchAttendanceList()}>
                    <Refresh size={20} />
                </IconButton>
            }
        >
            <TableContainer sx={{ maxHeight: 400 }}>
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
                        {staffList.map((row, index) => {
                            let color: ColorProps = 'secondary';
                            switch (row?.badgeText?.toLowerCase()) {
                                case 'open':
                                    color = 'success';
                                    break;
                                case 'progress':
                                    color = 'primary';
                                    break;
                                case 'error':
                                default:
                                    color = 'error';
                            }
                            return (
                                <TableRow hover key={index} sx={{ '& .MuiTableCell-root': { borderBottom: 'none' } }}>
                                    <TableCell>{(index + 1)}</TableCell>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell>{row.inTime}</TableCell>
                                    <TableCell>{row.outTime}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

export default AttendanceList;