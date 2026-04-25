import {
    alpha,
    useTheme,
    CardActions,
    CardContent,
    Button,
    Grid,
    Stack,
    TextField,
    Autocomplete,
    Typography,
    Box,
    FormControl,
    InputAdornment,
    Chip
} from "@mui/material";
import { Controller } from "react-hook-form";
import MainCard from "components/MainCard";
import {
    Calendar,
    UserTag,
    Archive,
    DirectboxReceive,
    Money,
    Hashtag,
    Edit2,
    Status
} from "iconsax-reactjs";

import UseAddEditReceiver from "./hooks/useAddEditReceiver";

const AddEditReceiver = () => {
    const theme = useTheme();
    const {
        isEdit,
        control,
        fields,
        isSubmitting,
        laundryItemOption,
        laundryWasherOption,
        onSubmit,
        handleBack,
        handleSubmit,
    } = UseAddEditReceiver();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {/* ── Hero Header ──────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 3,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '18px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                flexShrink: 0
                            }}
                        >
                            <DirectboxReceive size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {isEdit ? 'Update Recovery' : 'Log Recovery'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Record received laundry items from washers and update pending recovery logs.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* ── Section: Recovery Identity ──────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Status size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Recovery Details</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Controller
                                        name="receiveDate"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                type="date"
                                                label="Receiver Date"
                                                error={!!error}
                                                helperText={error?.message}
                                                disabled
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Calendar size={20} color={theme.palette.text.disabled} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                        rules={{ required: 'Please Select Date' }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Controller
                                        name="givenDate"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                type="date"
                                                label="Given Date"
                                                error={!!error}
                                                helperText={error?.message}
                                                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Calendar size={20} color={theme.palette.text.disabled} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                        rules={{
                                            required: 'Please Select Date',
                                            max: 'Future date is not allowed'
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                    <Controller
                                        name="laundryWasherID"
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                options={laundryWasherOption || []}
                                                getOptionLabel={(option: any) => option.label || ''}
                                                value={laundryWasherOption?.find((opt: any) => opt.value === value) || null}
                                                onChange={(_event, newValue) => onChange(newValue?.value || null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Laundry Washer"
                                                        placeholder="Choose washer..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start" sx={{ ml: 1 }}>
                                                                        <UserTag size={20} color={theme.palette.text.disabled} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <li {...props} key={option.id}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <UserTag size={18} color={theme.palette.primary.main} variant="Bulk" />
                                                            <Typography>{option.label}</Typography>
                                                        </Stack>
                                                    </li>
                                                )}
                                            />
                                        )}
                                        rules={{ required: 'Please Select Laundry Washer' }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ── Section: Itemized Recovery ───────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3, mt: 2 }}>
                                <Archive size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Recovery Checklist</Typography>
                                {fields.length > 0 && (
                                    <Chip
                                        label={`${fields.length} Items Found`}
                                        size="small"
                                        color="primary"
                                        sx={{ borderRadius: '6px', fontWeight: 600 }}
                                    />
                                )}
                            </Stack>

                            <Stack spacing={2.5}>
                                {fields.map((item, index) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: `1px solid ${theme.palette.divider}`,
                                            bgcolor: alpha(theme.palette.primary.main, 0.01),
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                                boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.05)}`
                                            }
                                        }}
                                    >
                                        <Grid container spacing={3} alignItems="center">
                                            {/* Item Identifier */}
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Controller
                                                    name={`detail.${index}.laundryItemID`}
                                                    control={control}
                                                    render={({ field: { value }, fieldState: { error } }) => (
                                                        <Autocomplete
                                                            fullWidth
                                                            disabled
                                                            options={laundryItemOption || []}
                                                            getOptionLabel={(opt: any) => opt.label || ''}
                                                            value={laundryItemOption?.find((opt: any) => opt.value === value) || null}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Laundry Item"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Archive size={18} color={theme.palette.text.disabled} />
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Financials & Limits */}
                                            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                                <Controller
                                                    name={`detail.${index}.price`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            disabled
                                                            label="Price"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Money size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                                <Controller
                                                    name={`detail.${index}.givenQty`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            disabled
                                                            label="Given"
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Hashtag size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                                <Controller
                                                    name={`detail.${index}.pendingQty`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            disabled
                                                            label="Pending"
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                                                                    borderColor: theme.palette.warning.light
                                                                }
                                                            }}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Hashtag size={18} color={theme.palette.warning.main} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Recovery Action */}
                                            <Grid size={{ xs: 12, md: 2 }}>
                                                <Controller
                                                    name={`detail.${index}.receiveQty`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label="Recover Now"
                                                            placeholder="0"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled={parseInt(fields[index].pendingQty) === 0}
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    bgcolor: alpha(theme.palette.success.main, 0.05),
                                                                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08) }
                                                                }
                                                            }}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Edit2 size={18} color={theme.palette.success.main} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                    rules={{
                                                        required: 'Required',
                                                        max: {
                                                            value: parseFloat(fields[index].pendingQty) || 0,
                                                            message: `Max: ${fields[index].pendingQty}`
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

                                {fields.length === 0 && (
                                    <Box sx={{ py: 8, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.02), borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}>
                                        <Archive size={48} variant="Bulk" color={theme.palette.text.disabled} style={{ marginBottom: 1, opacity: 0.3 }} />
                                        <Typography color="text.secondary" variant="body1">
                                            No pending recoveries found for the selected washer/date.
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {/* ── Actions ─────────────────────────────────────────── */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: alpha(theme.palette.secondary.main, 0.02),
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<Status size={18} style={{ transform: 'rotate(180deg)' }} />}
                        sx={{ borderRadius: '10px' }}
                    >
                        Back to List
                    </Button>
                    <Button
                        disabled={isSubmitting || fields.length === 0}
                        variant="contained"
                        type="submit"
                        size="large"
                        sx={{
                            borderRadius: '12px',
                            px: 5,
                            py: 1.5,
                            fontWeight: 700,
                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 16px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        {isEdit ? 'Update Recovery' : 'Complete Recovery'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditReceiver;