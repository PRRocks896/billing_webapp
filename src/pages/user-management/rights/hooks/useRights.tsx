import { useEffect, useRef, useState } from "react";

import useAuth from "hooks/useAuth";
import { useFieldArray, useForm } from "react-hook-form";
import { openSnackbar } from "api/snackbar";
import { getRoleList } from "service/role";
import { getRightList, createBulkRight } from "service/rights";

export type ModuleType = {
    rightID: number;
    moduleID: number;
    moduleName: string;
    all: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

export type RightsFormValue = {
    roleID: number | null;
    modules: ModuleType[];
}

const defaultValues: RightsFormValue = {
    roleID: null,
    modules: [],
}

const UseRights = () => {

    const { user, startLoading, stopLoading } = useAuth();

    const [roles, setRoles] = useState<any[]>([]);

    // Tracks the original server-fetched values so we can diff on submit
    const originalModulesRef = useRef<ModuleType[]>([]);

    const {
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<RightsFormValue>({
        mode: "onChange",
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "modules",
    });

    const fetchRightsModuleData = async (roleID: number) => {
        try {
            startLoading();
            reset({
                roleID: getValues("roleID"),
                modules: [],
            });

            const body = {
                where: {
                    isDeleted: false,
                    isActive: true,
                    roleID: roleID,
                },
                pagination: {
                    page: 1,
                    rows: 1000,
                    sortBy: "createdAt",
                    descending: true,
                },
            };

            const { success, message, data }: any = await getRightList(body);
                if (success) {
                const { rows } = data;
                const mapped: ModuleType[] = [];
                if (rows && rows.length > 0) {
                    rows.forEach((res: any) => {
                        const module: ModuleType = {
                            rightID: res?.id,
                            moduleID: res?.moduleID,
                            moduleName: res?.px_module?.name,
                            all: res?.view && res?.add && res?.edit && res?.delete,
                            view: res?.view,
                            add: res?.add,
                            edit: res?.edit,
                            delete: res?.delete,
                        };
                        mapped.push(module);
                        append(module);
                    });
                }
                // Snapshot the original values for dirty-checking on submit
                originalModulesRef.current = mapped;
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    };

    const onSubmit = async (info: RightsFormValue) => {
        try {
            startLoading();
            const originals = originalModulesRef.current;

            // Only include rows where at least one permission flag has changed
            const modifiedModules = info?.modules?.filter((res, idx) => {
                const orig = originals[idx];
                if (!orig) return true; // new row (no original snapshot)
                return (
                    res.view !== orig.view ||
                    res.add !== orig.add ||
                    res.edit !== orig.edit ||
                    res.delete !== orig.delete
                );
            });

            if (modifiedModules.length === 0) {
                openSnackbar({
                    open: true,
                    message: 'No changes detected.',
                    variant: 'alert',
                    severity: 'info',
                    alert: { color: 'info' }
                });
                return;
            }

            const body = modifiedModules.map((res) => {
                let data: any = {
                    id: res.rightID,
                    roleID: info.roleID,
                    moduleID: res.moduleID,
                    add: res.add,
                    view: res.view,
                    edit: res.edit,
                    delete: res.delete,
                };
                if (res.rightID !== null) {
                    data["updatedBy"] = user?.id;
                } else {
                    data["createdBy"] = user?.id;
                }
                return data;
            });
            const { success, message }: any = await createBulkRight(body);
            if (success) {
                reset({
                    roleID: null,
                    modules: [],
                });
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    };

    const onChangeAllHandler = (tag: string, index: number, newValue: boolean) => {
        if (tag === "all") {
            setValue(`modules.${index}.view`, newValue);
            setValue(`modules.${index}.add`, newValue);
            setValue(`modules.${index}.edit`, newValue);
            setValue(`modules.${index}.delete`, newValue);
        } else {
            const isChecked =
                getValues(`modules.${index}.view`) &&
                getValues(`modules.${index}.add`) &&
                getValues(`modules.${index}.edit`) &&
                getValues(`modules.${index}.delete`);
            setValue(`modules.${index}.all`, isChecked);
        }
    };

    const cancelHandler = () => {
        reset({
            roleID: null,
            modules: [],
        });
    };

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const payload = {
                    where: {
                        isDeleted: false,
                    },
                    pagination: {
                        page: 1,
                        rows: 1000,
                        sortBy: "createdAt",
                        descending: true,
                    },
                };
                const { success, message, data }: any = await getRoleList(payload);
                if (success) {
                    setRoles(data.rows);
                } else {
                    openSnackbar({
                        open: true,
                        message: message || 'Something went wrong',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    })
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
        })();
    }, []);

    return {
        roles,
        fields,
        control,
        isSubmitting,
        reset,
        onSubmit,
        setValue,
        getValues,
        handleSubmit,
        cancelHandler,
        onChangeAllHandler,
        fetchRightsModuleData,
    }
}

export default UseRights;