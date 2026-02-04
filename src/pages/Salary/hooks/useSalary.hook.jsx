import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import moment from "moment";

import { listPayload, rightsAccess, showToast, generateSlug, showTwoDecimal } from "../../../utils/helper";

import {
  updateSalary,
  deleteSalary,
  getSalaryList,
  downloadSalary,
  validateIfscCode,
  createBulkSalary,
} from "../../../service/salary";
import {
  getUserList
} from "../../../service/users";
import {
  getCompanyList
} from "../../../service/company";
import { getSalaryBranchWiseReport } from "../../../service/report";
import { salaryAction } from "../../../redux/salary";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useFieldArray, useForm } from "react-hook-form";

const useSalaryHooks = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const salaryData = useSelector((state) => state.salary.data);;
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { accessModules } = loggedInUser;

  const [month, setMonth] = useState((moment().month() + 1));
  const [year, setYear] = useState(moment().format('yyyy'));
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [branchList, setBranchList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);

  // pagination start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      staff: [
        // {
        // accountHolderName: "",
        // accountNumber: "",
        // employeeType: "",
        // ifscCode: "",
        // lateDeduction: "",
        // leave: "",
        // advance: 0,
        // leaveCut: "",
        // payableSalary: "",
        // salary: "",
        // staffId: "",
        // staffName: "",
        // tax: "",
        // weekOff: "",
        // workingDays: "",
        // expense: 0
        // }
      ]
    },
    mode: 'onChange'
  });

  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control: control,
    name: 'staff'
  })

  const handleRemove = (index) => {
    remove(index);
    const updatedStaffList = [...staffList];
    updatedStaffList.splice(index, 1);
    setStaffList(updatedStaffList);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const resetForm = () => {
    reset({
      staff: []
    })
  }

  const isAdmin = useMemo(() => {
    if (loggedInUser && loggedInUser.px_role && ['super admin', 'admin'].includes(loggedInUser.px_role.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  const visibleRows = useMemo(() => {
    return salaryData;
  }, [salaryData]);

  const fetchSalaryData = useCallback(async (searchValue = '') => {
    try {
      dispatch(startLoading());
      const body = listPayload(page, { searchText: searchValue });
      const response = await getSalaryList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        setCount(response?.data?.count);
        dispatch(salaryAction.storeSalary(payload));
      } else if (response?.statusCode === 404) {
        const payload = [];
        dispatch(salaryAction.storeSalary(payload));
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [dispatch, page]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteSalary(deleteId);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(salaryAction.removeSalary({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      dispatch(stopLoading());
    }
  };

  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateSalary(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(salaryAction.changeSalaryStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, { isActive: true, isDeleted: false, companyID: selectedCompany }, 1000);

      const response = await getUserList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.filter(item => item.roleID !== 1);
        setBranchList(branchOption);
        // setBranchList([{ id: null, branchName: 'All' }].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setBranchList(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const searchList = async () => {
    try {
      dispatch(startLoading());
      if (year && year.length !== 4) {
        showToast('Please Enter Correct Year', false);
        return;
      }
      if (selectedBranch === null) {
        showToast('Please Select Branch', false);
        return;
      }
      const { success, message, data } = await getSalaryBranchWiseReport({
        year: year,
        month: month,
        branchId: selectedBranch
      });
      if (!success) {
        showToast(message, false);
        return;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        setStaffList(data);
        data.forEach((item) => {
          append({
            ...item,
            expense: '0',
            advance: '0',
            isLeft: false,
            isPaid: false
          })
        })
      }
      // const body = listPayload(page, { year: year,
      //   month: month,
      //   branchId: selectedBranch?.id });
      // const response = await getSalaryList(body);
      // if (response?.statusCode === 200) {
      //   const payload = response?.data?.rows;
      //   setCount(response?.data?.count);
      //   dispatch(salaryAction.storeSalary(payload));
      // } else if (response?.statusCode === 404) {
      //   const payload = [];
      //   dispatch(salaryAction.storeSalary(payload));
      // }
    } catch (err) {
      showToast(err?.response?.statusText, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const download = async () => {
    try {
      dispatch(startLoading());
      if (year && year.length !== 4) {
        showToast('Please Enter Correct Year', false);
        return;
      }
      // if(selectedBranch === null) {
      //   showToast('Please Select Branch', false);
      //   return;
      // }
      const selectedComapnyDetail = companyList.find(item => item.id === selectedCompany);
      const selectedBranchDetail = branchList.filter((item) => item.id !== null).find(item => item.id === selectedBranch);
      const fileName = `${selectedBranchDetail ? `${generateSlug(selectedBranchDetail.branchName)}_salary_report` : selectedComapnyDetail ? `${generateSlug(selectedComapnyDetail.companyName)}_salary_report` : 'green_day_spa_salary_report'}_${month}_${year}.xlsx`;
      await downloadSalary({
        year: year,
        month: month,
        branchId: selectedBranch,
        companyID: selectedCompany
      }, fileName);
    } catch (err) {
      showToast(err?.response?.statusText, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const handleValidateIfscCode = async (value) => {
    try {
      // dispatch(startLoading()); // Loading state might interfere with typing if not handled carefully, usually not needed for single field validation
      const response = await validateIfscCode({
        ifscCode: value
      });
      if (response?.statusCode === 200) {
        return true;
      } else {
        return 'Invalid IFSC Code';
      }
    } catch (err) {
      // showToast(err?.response?.statusText, false);
      return 'Error validating IFSC Code';
    } finally {
      // dispatch(stopLoading());
    }
  }

  const fetchCompany = async () => {
    try {
      dispatch(startLoading());
      const body = listPayload(0, { isActive: true, isDeleted: false }, 1000);
      const response = await getCompanyList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        setCompanyList(payload);
      } else if (response?.statusCode === 404) {
        const payload = [];
        setCompanyList(payload);
      }
    } catch (err) {
      showToast(err?.response?.statusText, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const handleCheckAdvanceMoreThenSalary = (advanceValue, index) => {
    const selectedStaff = staffList.find((staff) => staff.staffId === getValues(`staff.${index}.staffId`));
    if (selectedStaff && selectedStaff.subSalary) {
      const expense = parseFloat(getValues(`staff.${index}.expense`)) || 0;
      const advance = parseFloat(advanceValue) || 0;
      const availableSalary = selectedStaff.subSalary - expense;

      if (advance > availableSalary) {
        const errorMsg = `Max advance: ₹${availableSalary.toFixed(2)}`;
        return errorMsg;
      }
    }
    return true;
  }

  const handleLeaveCalculation = (index) => {
    const selectedStaffRecord = staffList.find((staff) => staff.staffId === getValues(`staff.${index}.staffId`));
    const editableStaffRecord = getValues(`staff.${index}`);
    const totalLeave = parseInt(editableStaffRecord.leave || '0'); //+ parseInt(editableStaffRecord.weekOff || '0');
    let workingDays = editableStaffRecord.totalDays - totalLeave;
    setValue(`staff.${index}.workingDays`, workingDays);
    const perDaySalary = parseFloat(selectedStaffRecord.salary) / editableStaffRecord.totalDays;
    setValue(`staff.${index}.leaveCut`, showTwoDecimal(perDaySalary * totalLeave));
    const subSalary = (parseFloat(selectedStaffRecord.salary) - (perDaySalary * totalLeave));
    setValue(`staff.${index}.subSalary`, showTwoDecimal(subSalary));
    setStaffList(staffList.map((staff) => {
      if(staff.staffID === selectedStaffRecord.staffID) {
        return {
          ...staff,
          subSalary: showTwoDecimal(subSalary)
        }
      } else {
        return staff;
      }
    }));
  }

  const handleCalculation = (index) => {
    const selectedStaff = staffList.find((staff) => staff.staffId === getValues(`staff.${index}.staffId`));
    // if (selectedStaff && selectedStaff.subSalary) {
    const editableStaffRecord = getValues(`staff.${index}`);
    const totalLeave = parseInt(editableStaffRecord.leave || '0'); //+ parseInt(editableStaffRecord.weekOff || '0');
    let workingDays = editableStaffRecord.totalDays - totalLeave;
    setValue(`staff.${index}.workingDays`, workingDays);
    const perDaySalary = parseFloat(selectedStaff.salary) / editableStaffRecord.totalDays;
    setValue(`staff.${index}.leaveCut`, showTwoDecimal(perDaySalary * totalLeave));
    const subSalary = (parseFloat(selectedStaff.salary) - (perDaySalary * totalLeave));
    setValue(`staff.${index}.subSalary`, showTwoDecimal(subSalary));

    const expense = parseFloat(getValues(`staff.${index}.expense`)) || 0;
    const advance = parseFloat(getValues(`staff.${index}.advance`)) || 0;
    const total = subSalary - expense - advance;
    setValue(`staff.${index}.subSalary`, showTwoDecimal(total));
    handlePayableSalary(index);
    // }
  }

  const handlePayableSalary = (index) => {
    const subSalary = parseFloat(getValues(`staff.${index}.subSalary`)) || 0;
    const tax = parseFloat(getValues(`staff.${index}.tax`)) || 0;
    const payableSalary = subSalary - tax;
    setValue(`staff.${index}.payableSalary`, showTwoDecimal(payableSalary));
  }

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      let payload = data.staff?.map((item) => ({
        ...item,
        year: year,
        month: month,
        createdBy: loggedInUser.id,
      }))
      const { success, message } = await createBulkSalary(payload);
      if (!success) {
        showToast(message, false);
        return;
      }
      showToast(message, true);
      resetForm();
    } catch (error) {
      console.error(error);
      showToast(error?.response?.statusText, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchCompany();
    }
    // eslint-disable-next-line
  }, [isAdmin]);

  // useEffect(() => {
  //   if(isAdmin) {
  //     fetchBranch();
  //   }
  //   // eslint-disable-next-line
  // }, [isAdmin]);

  useEffect(() => {
    if (selectedCompany) {
      fetchBranch();
    }
    // eslint-disable-next-line
  }, [selectedCompany])

  useEffect(() => {
    fetchSalaryData()
  }, [fetchSalaryData]);

  return {
    page,
    year,
    count,
    month,
    fields,
    rights,
    control,
    isAdmin,
    branchList,
    companyList,
    visibleRows,
    isSubmitting,
    selectedBranch,
    selectedCompany,
    isDeleteModalOpen,
    setYear,
    onSubmit,
    setMonth,
    download,
    getValues,
    resetForm,
    searchList,
    fetchBranch,
    handleSubmit,
    handleRemove,
    deleteHandler,
    handleChangePage,
    handleCalculation,
    setSelectedBranch,
    setSelectedCompany,
    changeStatusHandler,
    setIsDeleteModalOpen,
    deleteBtnClickHandler,
    handleValidateIfscCode,
    handleLeaveCalculation,
    handleCheckAdvanceMoreThenSalary,
  }
}

export default useSalaryHooks;