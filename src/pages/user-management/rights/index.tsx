import { Controller } from "react-hook-form";
import { useMemo, useState } from "react";

import MainCard from "components/MainCard";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";

import { ArrowDown2, ArrowRight2, SearchNormal1, CloseCircle } from "iconsax-reactjs";

import UseRights from "./hooks/useRights";

// ─── Permission columns config ────────────────────────────────────────────────

const MODULE_COLS = [
    { key: "all",    label: "All"    },
    { key: "view",   label: "View"   },
    { key: "add",    label: "Add"    },
    { key: "edit",   label: "Edit"   },
    { key: "delete", label: "Delete" },
] as const;

const SECTION_COLS = [
    { key: "view",     label: "View"     },
    { key: "download", label: "Download" },
    { key: "upload",   label: "Upload"   },
] as const;

// ─── Sub-component: Section Rows ──────────────────────────────────────────────

const SectionRows = ({
    moduleIndex,
    sections,
    control,
    onChangeSectionAllHandler,
}: {
    moduleIndex: number;
    sections: any[];
    control: any;
    onChangeSectionAllHandler: (mi: number, si: number, v: boolean) => void;
}) => {
    const theme = useTheme();

    if (!sections || sections.length === 0) return null;

    return (
        <Box sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.4), borderTop: `1px solid ${theme.palette.divider}` }}>
            {/* Section header row */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr repeat(4, 80px)',
                    alignItems: 'center',
                    px: 2,
                    py: 0.5,
                    bgcolor: alpha(theme.palette.primary.lighter, 0.7),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box />
                <Typography variant="caption" fontWeight={600} color="text.secondary">Section Name</Typography>
                <Typography variant="caption" fontWeight={600} color="text.secondary" textAlign="center">All</Typography>
                {SECTION_COLS.map((col) => (
                    <Typography key={col.key} variant="caption" fontWeight={600} color="text.secondary" textAlign="center">
                        {col.label}
                    </Typography>
                ))}
            </Box>

            {/* Section data rows */}
            {sections.map((section: any, si: number) => (
                <Box
                    key={section.sectionRightID ?? `new-${si}`}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr repeat(4, 80px)',
                        alignItems: 'center',
                        px: 2,
                        py: 0.25,
                        '&:not(:last-child)': { borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` },
                    }}
                >
                    {/* Indent marker */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 2, height: 28, bgcolor: 'primary.light', borderRadius: 1 }} />
                    </Box>

                    {/* Section name + key badge */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2">{section.sectionName}</Typography>
                        <Chip
                            label={section.sectionKey}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 18, fontFamily: 'monospace' }}
                        />
                    </Stack>

                    {/* All checkbox (controls view + download + upload) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Controller
                            control={control}
                            name={`modules.${moduleIndex}.sections.${si}.view` as any}
                            render={({ field: { value: viewVal } }) => (
                                <Controller
                                    control={control}
                                    name={`modules.${moduleIndex}.sections.${si}.download` as any}
                                    render={({ field: { value: dlVal } }) => (
                                        <Controller
                                            control={control}
                                            name={`modules.${moduleIndex}.sections.${si}.upload` as any}
                                            render={({ field: { value: upVal } }) => {
                                                const allChecked = !!viewVal && !!dlVal && !!upVal;
                                                const someChecked = !!viewVal || !!dlVal || !!upVal;
                                                return (
                                                    <Checkbox
                                                        size="small"
                                                        checked={allChecked}
                                                        indeterminate={!allChecked && someChecked}
                                                        onChange={(_, newVal) =>
                                                            onChangeSectionAllHandler(moduleIndex, si, newVal)
                                                        }
                                                    />
                                                );
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>

                    {/* Individual section permission checkboxes */}
                    {SECTION_COLS.map((col) => (
                        <Box key={col.key} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Controller
                                control={control}
                                name={`modules.${moduleIndex}.sections.${si}.${col.key}` as any}
                                render={({ field: { onBlur, onChange, value } }) => (
                                    <Checkbox
                                        size="small"
                                        checked={!!value}
                                        onChange={(_, newVal) => onChange(newVal)}
                                        onBlur={onBlur}
                                    />
                                )}
                            />
                        </Box>
                    ))}
                </Box>
            ))}
        </Box>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Rights = () => {
    const theme = useTheme();

    // ── Local search state ────────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState<string>("");

    const {
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
        toggleExpanded,
        onChangeAllHandler,
        onChangeSectionAllHandler,
        fetchRightsModuleData,
    } = UseRights();

    const hasModules = fields.length > 0;

    // Tag every field with its true form array index BEFORE filtering
    // This is critical — form paths like `modules.${index}.*` must use the
    // ORIGINAL index, not the index inside the filtered subset.
    const indexedFields = useMemo(
        () => fields.map((f, i) => ({ ...f, originalIndex: i })),
        [fields]
    );

    const filteredFields = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return indexedFields;
        return indexedFields.filter((f: any) =>
            f.moduleName?.toLowerCase().includes(q)
        );
    }, [indexedFields, searchTerm]);

    const noSearchResults = hasModules && filteredFields.length === 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <MainCard title="Assign Rights">
                        {/* Role Selector + Search Row */}
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <Controller
                                    name="roleID"
                                    control={control}
                                    rules={{ required: "Please select a role" }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <Autocomplete
                                            value={roles.find((r: any) => r.id === value) ?? null}
                                            onChange={(_, selected: any) => {
                                                if (selected?.id) {
                                                    onChange(selected.id);
                                                    setSearchTerm(""); // clear search on role change
                                                    fetchRightsModuleData(selected.id);
                                                }
                                            }}
                                            onBlur={onBlur}
                                            options={roles}
                                            getOptionLabel={(o: any) => o.name}
                                            isOptionEqualToValue={(o: any, v: any) => o.id === v?.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Role"
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Module search — only visible once modules are loaded */}
                            {hasModules && (
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search module..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchNormal1 size={16} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: searchTerm ? (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Clear search">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setSearchTerm("")}
                                                                edge="end"
                                                            >
                                                                <CloseCircle size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ) : null,
                                            },
                                        }}
                                    />
                                </Grid>
                            )}

                            {/* Result count badge */}
                            {hasModules && searchTerm && (
                                <Grid size="auto">
                                    <Chip
                                        label={`${filteredFields.length} of ${fields.length}`}
                                        size="small"
                                        color={filteredFields.length === 0 ? 'error' : 'primary'}
                                        variant="outlined"
                                    />
                                </Grid>
                            )}
                        </Grid>

                        {/* Rights Table */}
                        {hasModules && (
                            <Box sx={{ mt: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden', maxHeight: 520, overflowY: 'auto' }}>

                                {/* Table Header — sticky so it stays visible while scrolling */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '40px 1fr repeat(5, 80px)',
                                        alignItems: 'center',
                                        px: 2,
                                        py: 1,
                                        bgcolor: theme.palette.grey[100],
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 2,
                                        boxShadow: `0 2px 4px ${alpha(theme.palette.grey[900], 0.08)}`,
                                    }}
                                >
                                    <Box />
                                    <Typography variant="subtitle2" fontWeight={700}>Module</Typography>
                                    {MODULE_COLS.map((col) => (
                                        <Typography key={col.key} variant="subtitle2" fontWeight={700} textAlign="center">
                                            {col.label}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* No search results */}
                                {noSearchResults && (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No module matches &ldquo;<strong>{searchTerm}</strong>&rdquo;
                                        </Typography>
                                    </Box>
                                )}

                                {/* Module Rows — use filteredFields with originalIndex */}
                                {filteredFields.map((field: any) => {
                                    const index = field.originalIndex; // ← form path index
                                    const hasSections = Array.isArray(field.sections) && field.sections.length > 0;

                                    return (
                                        <Box key={field.id}>
                                            {/* Module Row */}
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '40px 1fr repeat(5, 80px)',
                                                    alignItems: 'center',
                                                    px: 2,
                                                    py: 0.5,
                                                    bgcolor: hasSections
                                                        ? alpha(theme.palette.secondary.lighter, 0.3)
                                                        : 'transparent',
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.lighter, 0.2) },
                                                    transition: 'background-color 0.15s',
                                                    cursor: hasSections ? 'pointer' : 'default',
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                {/* Expand/Collapse Toggle */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {hasSections ? (
                                                        <Controller
                                                            control={control}
                                                            name={`modules.${index}.expanded`}
                                                            render={({ field: { value } }) => (
                                                                <Tooltip title={value ? "Collapse Sections" : "Expand Sections"}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => toggleExpanded(index)}
                                                                        sx={{ p: 0.5 }}
                                                                    >
                                                                        {value
                                                                            ? <ArrowDown2 size={14} />
                                                                            : <ArrowRight2 size={14} />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        />
                                                    ) : null}
                                                </Box>

                                                {/* Module Name */}
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography variant="body2" fontWeight={hasSections ? 600 : 400}>
                                                        {field.moduleName}
                                                    </Typography>
                                                    {hasSections && (
                                                        <Chip
                                                            label={`${field.sections.length} section${field.sections.length > 1 ? 's' : ''}`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.6rem', height: 18 }}
                                                        />
                                                    )}
                                                </Stack>

                                                {/* Module permission checkboxes */}
                                                {MODULE_COLS.map((col) => (
                                                    <Box key={col.key} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Controller
                                                            control={control}
                                                            name={`modules.${index}.${col.key}` as any}
                                                            render={({ field: { onBlur, onChange, value } }) => (
                                                                <Checkbox
                                                                    size="small"
                                                                    checked={!!value}
                                                                    onChange={(_, newVal) => [
                                                                        onChange(newVal),
                                                                        onChangeAllHandler(col.key, index, newVal),
                                                                    ]}
                                                                    onBlur={onBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>

                                            {/* Collapsible Section Rows */}
                                            {hasSections && (
                                                <Controller
                                                    control={control}
                                                    name={`modules.${index}.expanded`}
                                                    render={({ field: { value: expanded } }) => (
                                                        <Collapse in={!!expanded} timeout="auto" unmountOnExit>
                                                            <SectionRows
                                                                moduleIndex={index}
                                                                sections={field.sections}
                                                                control={control}
                                                                onChangeSectionAllHandler={onChangeSectionAllHandler}
                                                            />
                                                        </Collapse>
                                                    )}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Empty state */}
                        {!hasModules && (
                            <Box sx={{ mt: 3, py: 6, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Select a role above to load its module permissions.
                                </Typography>
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" sx={{ mt: 3 }} spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" color="secondary" onClick={cancelHandler}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting || !hasModules}>
                                {isSubmitting ? 'Saving...' : 'Save Rights'}
                            </Button>
                        </Stack>
                    </MainCard>
                </Grid>
            </Grid>
        </form>
    );
};

export default Rights;