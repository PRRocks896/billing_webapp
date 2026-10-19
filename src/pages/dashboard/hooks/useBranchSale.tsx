import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useEffect, useState } from "react";
import { getCityByFind } from "service/city";
import { getBranchSaleReport } from "service/dailyReport";
import { getBranch } from "service/user";

const UseBranchSale = () => {
    const { startLoading, stopLoading } = useAuth();

    const [month, setMonth] = useState<number | null>(new Date().getMonth());
    const [year, setYear] = useState<number | null>(new Date().getFullYear());

    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [cityOptions, setCityOptions] = useState<any[]>([]);

    const [labels, setLabels] = useState<string[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);

    // ── Helpers ──────────────────────────────────────────────────────────────────
    const showError = (msg: string) =>
        openSnackbar({ open: true, message: msg, variant: 'alert', severity: 'error', alert: { color: 'error' } });
    /** Throws if the API response indicates failure — keeps the happy path flat. */
    const assertSuccess = (response: any, fallback = 'Something went wrong') => {
        if (!response?.success) throw new Error(response?.message || fallback);
        return response;
    };
    const isBranchRole = (item: any) =>
        item?.px_role?.name?.toLowerCase() === 'branch';

    const fetchBranchSalesReport = async () => {
        try {
            startLoading();
            const dateMoment = moment({
                year: year ?? moment().year(),
                month: month ?? moment().month(),
                day: 1
            });

            const payload = {
                startDate: dateMoment.clone().startOf('month').format('YYYY-MM-DD'),
                endDate: dateMoment.clone().endOf('month').format('YYYY-MM-DD'),
                userID: selectedBranch
            }
            const { data } = assertSuccess(await getBranchSaleReport(payload));
            if (data?.chart && data.chart.length > 0) {
                // Reverse to get chronological order (e.g. Jun -> Jul -> Aug)
                const chartList = [...data.chart].reverse();

                const labels = chartList.map((item: any) =>
                    item.month ? item.month.slice(0, 3) : ''
                );

                const datasets = [
                    {
                        label: 'upi',
                        data: chartList.map((item: any) => Number(item.upi) || 0)
                    },
                    {
                        label: 'card',
                        data: chartList.map((item: any) => Number(item.card) || 0)
                    },
                    {
                        label: 'cash',
                        data: chartList.map((item: any) => Number(item.cash) || 0)
                    },
                    {
                        label: 'grandtotal',
                        data: chartList.map((item: any) => Number(item.total) || 0)
                    }
                ];

                const formattedData = {
                    labels,
                    datasets
                };
                setLabels(formattedData.labels);
                setSalesData(formattedData.datasets?.map((item: any) => {
                    return {
                        name: item.label.toUpperCase(),
                        data: item.data
                    }
                }))
            } else {
                setLabels([]);
                setSalesData([]);
            }
        } catch (err: any) {
            showError(err?.message || 'Failed to load branch sales report');
        } finally {
            stopLoading();
        }
    }

    const fetchBranch = async (cityId: number) => {
        try {
            startLoading();
            let where = {
                isActive: true,
                isDeleted: false,
                cityID: cityId || selectedCity
            }
            const { data: branches } = assertSuccess(await getBranch(where));
            const branchOptions = branches.filter(isBranchRole)?.map((branch: any) => ({
                label: branch.lastName,
                value: branch.id,
            }));
            setBranchOptions(branchOptions);
        } catch (err: any) {
            showError(err?.message || 'Failed to load branch options');
        } finally {
            stopLoading();
        }
    }

    // ── Fetch city + branch options ─────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                startLoading();
                let where = {
                    isActive: true,
                    isDeleted: false
                }
                const { data: cities } = assertSuccess(await getCityByFind(where));
                const cityOptions = cities?.map((city: any) => ({
                    label: city.name,
                    value: city.id,
                }));
                setCityOptions(cityOptions);
            } catch (err: any) {
                showError(err?.message || 'Failed to load branch options');
            } finally {
                stopLoading();
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchBranch(selectedCity);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (month !== null && year !== null && selectedBranch) {
            fetchBranchSalesReport();
        }
    }, [month, year, selectedBranch]);

    return {
        year,
        setYear,
        month,
        setMonth,
        selectedBranch,
        setSelectedBranch,
        branchOptions,
        selectedCity,
        setSelectedCity,
        cityOptions,
        labels,
        salesData,
        fetchBranch
    }
}

export default UseBranchSale;