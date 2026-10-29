import { useCallback, useEffect, useMemo, useState } from 'react';

import useAuth from 'hooks/useAuth';
import useGeoLocation from 'hooks/useGeoLocation';
import { ROWS } from 'utils/constant';
import { getStaffList } from 'service/staff';
import { openSnackbar } from 'api/snackbar';
import { HeadCell, ArrangementOrder } from 'types/table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Refresh, Scanner, TickCircle } from 'iconsax-reactjs';
import { FaceMode, FaceStaff } from '../component/FaceCaptureDialog';

export const isFaceRegistered = (row: any) => !!(row?.faceRegisteredAt || row?.faceDescriptor);

const UseFaceRecognition = () => {
  const { isAdmin, user, startLoading, stopLoading } = useAuth();
  // Location is only needed for attendance punches, so it is requested on demand
  const { location, getLocation } = useGeoLocation(false);

  const [list, setList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(ROWS);
  const [searchText, setSearchText] = useState<string>('');
  const [order, setOrder] = useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [dialog, setDialog] = useState<{ mode: FaceMode; staff: FaceStaff } | null>(null);

  const fetch = useCallback(async () => {
    const payload: any = {
      where: { searchText, isDeleted: false },
      pagination: { page: page + 1, rows, sortBy: orderBy, descending: order === 'desc' }
    };
    if (!isAdmin) {
      payload.where.userID = user?.id;
    }

    try {
      startLoading();
      const { success, message, data }: any = await getStaffList(payload);
      if (success) {
        setList(data.rows);
        setTotalCount(data.count);
      } else {
        setList([]);
        setTotalCount(0);
        openSnackbar({ open: true, message: message || 'Something went wrong', variant: 'alert', alert: { color: 'error' } });
      }
    } catch (error: any) {
      openSnackbar({
        open: true,
        message: error?.message || error?.messageCode || 'Something went wrong',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      stopLoading();
    }
  }, [page, rows, searchText, order, orderBy, isAdmin, user?.id]);

  useEffect(() => {
    const timeout = setTimeout(fetch, 500);
    return () => clearTimeout(timeout);
  }, [fetch]);

  const handleRequestSort = (_: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const searchHandler = (text: string) => {
    setPage(0);
    setSearchText(text);
  };

  const openDialog = useCallback(
    (mode: FaceMode, row: any) => {
      if (mode === 'attendance') getLocation();
      setDialog({
        mode,
        staff: {
          id: row.id,
          name: row.name,
          nickName: row.nickName,
          userID: row.userID,
          faceRegisteredAt: row.faceRegisteredAt
        }
      });
    },
    [getLocation]
  );

  const closeDialog = useCallback(() => setDialog(null), []);

  const Column: HeadCell[] = useMemo(() => {
    const col: any[] = [
      { id: 'name', label: 'Name', align: 'left', numeric: false, disablePadding: false, isSortable: true },
      { id: 'nickName', label: 'Nick Name', align: 'left', numeric: false, disablePadding: false, isSortable: true },
      {
        id: 'userID',
        label: 'Branch Name',
        align: 'left',
        numeric: false,
        disablePadding: false,
        renderCell: (row: any) => <Box>{row?.px_user?.lastName}</Box>
      },
      {
        id: 'faceRegisteredAt',
        label: 'Face Status',
        align: 'left',
        numeric: false,
        disablePadding: false,
        renderCell: (row: any) => (
          <Chip
            variant="filled"
            size="medium"
            icon={isFaceRegistered(row) ? <TickCircle size={16} /> : undefined}
            label={isFaceRegistered(row) ? 'Registered' : 'Not Registered'}
            color={isFaceRegistered(row) ? 'success' : 'default'}
          />
        )
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        numeric: false,
        disablePadding: false,
        renderCell: (row: any) => {
          const registered = isFaceRegistered(row);
          const inactive = !row.isActive;
          const button = registered ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Scanner size={18} />}
              disabled={inactive}
              onClick={() => openDialog('attendance', row)}
              sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              Mark Attendance
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<Scanner size={18} />}
              disabled={inactive}
              onClick={() => openDialog('register', row)}
              sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              Register Face
            </Button>
          );
          return (
            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
              <Tooltip title={inactive ? 'Staff is inactive' : ''}>
                <span>{button}</span>
              </Tooltip>
              {registered && (
                <Tooltip title="Register face again">
                  <span>
                    <IconButton disabled={inactive} onClick={() => openDialog('register', row)}>
                      <Refresh size={18} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Stack>
          );
        }
      }
    ];
    if (isAdmin) {
      col.splice(1, 0, { id: 'phoneNumber', label: 'Phone Number', align: 'left', numeric: false, disablePadding: false, isSortable: true });
    }
    return col;
  }, [isAdmin, openDialog]);

  return {
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
  };
};

export default UseFaceRecognition;
