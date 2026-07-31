
import { useEffect, useState } from "react";

import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";
import {
    fetchLaundryStockHistorysViaPayload
} from "service/laundry-stock-history";
import { getBranch } from "service/user";
import { getLaundryItemDropdownList } from "service/laundry-item";

const UseLaundryStockHistory = () => {
    const { startLoading, stopLoading, user } = useAuth();

    const [laundryItemList, setLaundryItemList] = useState<any[]>([]);
    const [branchList, setBranchList] = useState<any[]>([]);
    const [laundryStockHistoryList, setLaundryStockHistoryList] = useState<any[]>([]);

    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const fetchBranch = async () => {
        try {
            startLoading();
            const { success, data, message }: any = await getBranch({
                isActive: true,
                isDeleted: false
            });
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: "alert",
                    severity: 'error',
                    alert: {
                        color: "error"
                    }
                })
                return;
            }
            if (data && data.length > 0) {
                setBranchList(data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                }))
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    };

    const fetchLaundryItem = async () => {
        try {
            startLoading();
            const { success, data, message }: any = await getLaundryItemDropdownList({
                isActive: true,
                isDeleted: false
            });
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: "alert",
                    severity: 'error',
                    alert: {
                        color: "error"
                    }
                })
                return;
            }
            if (data && data.length > 0) {
                // if (selectedBranch) {
                //     setLaundryItemList(data?.filter((item: any) => {
                //         if (item?.userID === selectedBranch) {
                //             return item;
                //         }
                //     }))
                // } else {
                setLaundryItemList(data);
                // }
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    const fetchLaundryStockHistory = async () => {
        try {
            if (!selectedBranch) {
                openSnackbar({
                    open: true,
                    message: "Please select branch",
                    variant: "alert",
                    alert: {
                        color: "error"
                    }
                })
                return;
            }

            if (!selectedItem) {
                openSnackbar({
                    open: true,
                    message: "Please select item",
                    variant: "alert",
                    alert: {
                        color: "error"
                    }
                })
                return;
            }
            startLoading();
            const { success, data, message }: any = await fetchLaundryStockHistorysViaPayload({
                userID: typeof selectedBranch === 'object' ? selectedBranch?.id : selectedBranch,
            });
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: "alert",
                    severity: 'error',
                    alert: {
                        color: "error"
                    }
                })
                return;
            }
            console.log(data);
            if (data && Array.isArray(data) && data.length > 0) {
                if (selectedItem && selectedItem.value) {
                    const filteredData = data?.filter((item: any) => {
                        if (item?.px_laundry_stock?.laundryItemID === selectedItem?.value) {
                            return item;
                        }
                    })
                    console.log(filteredData);
                    if (filteredData && filteredData.length > 0) {
                        setLaundryStockHistoryList(filteredData);
                        return;
                    } else {
                        openSnackbar({
                            open: true,
                            message: 'No stock history found',
                            variant: 'alert',
                            severity: 'error',
                            alert: {
                                color: 'error'
                            }
                        })
                        setLaundryStockHistoryList([]);
                        return;
                    }
                } else {
                    setLaundryStockHistoryList(data);
                    return;
                }
            } else {
                openSnackbar({
                    open: true,
                    message: 'No stock history found',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                setLaundryStockHistoryList([]);
                return;
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        fetchBranch();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchLaundryItem();
        }
    }, [selectedBranch]);

    return {
        laundryItemList,
        branchList,
        selectedBranch,
        selectedItem,
        laundryStockHistoryList,
        setSelectedBranch,
        setSelectedItem,
        fetchBranch,
        fetchLaundryItem,
        fetchLaundryStockHistory,
        setLaundryStockHistoryList
    }
}

export default UseLaundryStockHistory;