import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

// project components
import MainCard from 'components/MainCard';

// hooks & utils
import useAddEditStaff from "../hooks/useAddEditStaff";
import { EMAIL_REGEX, PHONE_REGEX } from 'utils/constant';

// assets
import {
    Personalcard,
    Profile2User,
    User,
    Call,
    Briefcase,
    People,
    Location,
    Bank,
    ArrowLeft,
    Wallet,
    ShieldTick,
    DirectboxSend,
    Map
} from 'iconsax-reactjs';
import OtpModal from 'components/OtpModal';
import FileUpload from 'components/FileUpload';

const AddEditStaff = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        isEdit,
        isAdmin,
        control,
        staffData,
        statesList,
        isMarriage,
        branchList,
        isSubmitting,
        isStaffFound,
        countryCodeList,
        employeeTypeList,
        isShowBankDetail,
        staffPhoneNumber,
        openVerifyOtpModal,
        isSameBranchStaff,
        ifscVerified,
        setValue,
        onSubmit,
        findStaff,
        getValues,
        handleBack,
        handleSubmit,
        handleIfscVerify,
        setIsStaffFound,
        toggleIsStaffFound,
        setStaffPhoneNumber,
        setIsShowBankDetail,
        setOpenVerifyOtpModal,
        handleStaffTransferVerify,
        handleStaffTransferRequest
    } = useAddEditStaff();

    // Non-admin: bank details always visible when the form is active
    // isFormActive covers: edit mode, new staff (not found), OR found staff for a non-admin bank update
    const isFormActive = isEdit || isStaffFound === false //|| (isStaffFound === true && !isAdmin);
    const showBankDetail = isShowBankDetail || (!isAdmin && isFormActive);
    // When editing as non-admin, only bank details are editable
    const isBankOnlyMode = isEdit && !isAdmin;

    /* ── Shared card style ───────────────────────────────── */
    const sectionCardSx = {
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
        }
    };

    return (
        <>
            {!isEdit &&
                <MainCard
                    content={false}
                    sx={{
                        overflow: 'visible',
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: '16px',
                        boxShadow: (t: any) => t.customShadows?.z1 || 1,
                    }}
                >
                    {/* ── Hero Header ──────────────────────────────────────── */}
                    <Box
                        sx={(t) => ({
                            px: 3,
                            py: 3,
                            background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)} 0%, ${alpha(t.palette.primary.light, 0.05)} 100%)`,
                            borderBottom: `1px solid ${t.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                        })}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={(t) => ({
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 8px 16px ${alpha(t.palette.primary.main, 0.35)}`,
                                })}
                            >
                                <People size={24} color="#fff" variant="Bold" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                    Staff Registration
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Search for existing staff or register a new team member
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleBack}
                            startIcon={<ArrowLeft size={16} />}
                            sx={{ borderRadius: '10px', px: 2 }}
                        >
                            Back to List
                        </Button>
                    </Box>

                    {/* ── Search Row ───────────────────────────────────────── */}
                    <Box sx={{ p: 4 }}>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                Quick Search
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter the staff member's phone number to check if they are already in the system.
                            </Typography>
                        </Stack>

                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    value={staffPhoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.trim();
                                        if (value === '' || (value.match(/^[0-9]+$/) && value.length <= 10)) {
                                            setStaffPhoneNumber(value)
                                        }
                                    }}
                                    placeholder="Search by staff phone number (e.g. 9876543210)"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Call size={22} color={theme.palette.primary.main} variant="Bold" />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '14px',
                                            height: '56px',
                                            fontSize: '1rem',
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                            '& fieldset': {
                                                borderColor: alpha(theme.palette.divider, 0.1),
                                            },
                                            '&:hover fieldset': {
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    onClick={findStaff}
                                    startIcon={<Personalcard size={22} variant="Bold" />}
                                    sx={(t) => ({
                                        height: 56,
                                        borderRadius: '14px',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: `0 8px 16px ${alpha(t.palette.primary.main, 0.3)}`,
                                        '&:hover': {
                                            boxShadow: `0 12px 24px ${alpha(t.palette.primary.main, 0.4)}`,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.2s ease',
                                    })}
                                >
                                    Find Staff
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            }

            <Box sx={{ my: 3 }}>
                {isStaffFound !== null && isStaffFound === true && (
                    <MainCard
                        content={false}
                        sx={(t) => ({
                            border: `1px solid ${alpha(t.palette.success.main, 0.2)}`,
                            background: alpha(t.palette.success.main, 0.02),
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            boxShadow: (t: any) => t.customShadows?.z1 || 1,
                        })}
                    >
                        {/* Success Gradient Decoration */}
                        <Box
                            sx={(t) => ({
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: `linear-gradient(to bottom, ${t.palette.success.main}, ${t.palette.success.light})`,
                            })}
                        />

                        <Box sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                        sx={(t) => ({
                                            width: 56,
                                            height: 56,
                                            borderRadius: '16px',
                                            background: alpha(t.palette.success.main, 0.1),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        })}
                                    >
                                        <User size={32} color={theme.palette.success.main} variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>
                                            {staffData?.nickName}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Call size={14} color={theme.palette.text.secondary} />
                                            <Typography variant="body2" color="text.secondary">
                                                {staffData?.phoneNumber}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Box
                                    sx={(t) => ({
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '8px',
                                        background: alpha(t.palette.success.main, 0.1),
                                        color: t.palette.success.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    })}
                                >
                                    <ShieldTick size={16} variant="Bold" />
                                    <Typography variant="caption" fontWeight={700}>Staff Found</Typography>
                                </Box>
                            </Stack>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Location size={14} /> Current Branch
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {staffData?.px_user?.lastName || 'N/A'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Briefcase size={14} /> Employee Type
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {staffData?.px_employee_type?.name || 'N/A'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ShieldTick size={14} /> Account Status
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: staffData?.px_user?.isActive ? 'success.main' : 'error.main',
                                                }}
                                            />
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {staffData?.px_user?.isActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                                    This staff member is already registered in the system. Would you like to initiate a <strong>transfer request</strong> to move them to this branch?
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    {!isSameBranchStaff &&
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="success"
                                            onClick={handleStaffTransferRequest}
                                            startIcon={<DirectboxSend size={20} variant="Bold" />}
                                            sx={(t) => ({
                                                minWidth: 180,
                                                height: 48,
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                boxShadow: `0 4px 14px ${alpha(t.palette.success.main, 0.35)}`,
                                                '&:hover': {
                                                    boxShadow: `0 6px 20px ${alpha(t.palette.success.main, 0.45)}`,
                                                }
                                            })}
                                        >
                                            Initiate Transfer
                                        </Button>
                                    }
                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setStaffPhoneNumber('');
                                            setIsStaffFound(null);
                                        }}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </MainCard>
                )}

                {openVerifyOtpModal && (
                    <OtpModal
                        title={"Verify Staff Phone Number"}
                        isOpen={openVerifyOtpModal}
                        setOpen={(value: boolean) => setOpenVerifyOtpModal(value)}
                        handleCancelVerifyPermission={() => setOpenVerifyOtpModal(false)}
                        handleEnterOtp={handleStaffTransferVerify}
                        resendOtp={handleStaffTransferRequest}
                    />
                )}
            </Box>
            {(isEdit || (isStaffFound !== null && isStaffFound === false) /*|| (isStaffFound === true && !isAdmin)*/) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <MainCard
                        content={false}
                        sx={{
                            overflow: 'visible',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '16px',
                            boxShadow: (t: any) => t.customShadows?.z1 || 1,
                        }}
                    >
                        {/* ── Hero Header ──────────────────────────────────────── */}
                        <Box
                            sx={{
                                px: 3,
                                py: 3.5,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                                borderTopLeftRadius: '16px',
                                borderTopRightRadius: '16px',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '14px',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    }}
                                >
                                    <Profile2User size={24} color="#fff" variant="Bold" />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        {(isStaffFound === true && !isAdmin) || isBankOnlyMode ? 'Update Bank Details' : title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {(isStaffFound === true && !isAdmin) || isBankOnlyMode
                                            ? 'Update bank account details for salary transfers.'
                                            : 'Manage staff profiling, employment terms, and financial records.'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                            <Grid container spacing={3}>
                                {!(isStaffFound === true && !isAdmin) && !isBankOnlyMode && (<>

                                    {/* ══════════════════════════════════════════════════════
                                        Section 1: Employment Classification
                                       ══════════════════════════════════════════════════════ */}
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={sectionCardSx}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <Personalcard size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Employment Classification</Typography>
                                                    <Typography variant="caption" color="text.secondary">Assign employee type and branch</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5} alignItems="center">
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name="employeeTypeID"
                                                        control={control}
                                                        rules={{ required: 'Employee Type is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <Box sx={{ p: 1, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                                                <FormLabel sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 0.5, display: 'block', color: theme.palette.text.secondary }}>Staff Employee Type</FormLabel>
                                                                <RadioGroup row {...field}>
                                                                    {employeeTypeList.map((type: any) => (
                                                                        <FormControlLabel key={type.id} value={type.id} control={<Radio size="small" />} label={<Typography variant="body2">{type.name}</Typography>} />
                                                                    ))}
                                                                </RadioGroup>
                                                                <FormHelperText error>{error?.message}</FormHelperText>
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    {isAdmin && (
                                                        <Controller
                                                            name="userID"
                                                            control={control}
                                                            rules={{ required: 'Branch is required' }}
                                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                                <Autocomplete
                                                                    fullWidth
                                                                    value={branchList?.find((branch: any) => branch.id === value) || null}
                                                                    onChange={(_, newValue) => onChange(newValue ? newValue.id : null)}
                                                                    onBlur={onBlur}
                                                                    options={branchList}
                                                                    getOptionLabel={(option: any) => option.lastName}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} label="Assigned Branch" error={!!error} helperText={error?.message} />
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    {/* ══════════════════════════════════════════════════════
                                        Section 2: Personal Profile
                                       ══════════════════════════════════════════════════════ */}
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={sectionCardSx}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <User size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Personal Profile</Typography>
                                                    <Typography variant="caption" color="text.secondary">Basic identity & contact information</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5}>
                                                {/* Row 1: Name, Nick Name, Phone */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="name"
                                                        control={control}
                                                        rules={{ required: 'Full Name is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Official Name (As per Govt. ID)"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="nickName"
                                                        control={control}
                                                        rules={{ required: "Display Name is required" }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Display / Nick Name"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{ startAdornment: <InputAdornment position="start"><ShieldTick size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Grid container spacing={1.5}>
                                                        <Grid size={{ xs: 4 }}>
                                                            <Controller
                                                                name='countryCode'
                                                                control={control}
                                                                rules={{ required: 'Required' }}
                                                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                                    <Autocomplete
                                                                        fullWidth
                                                                        value={countryCodeList.find((c: any) => c.value === value) || null}
                                                                        onChange={(_, newValue) => onChange(newValue ? newValue.value : null)}
                                                                        onBlur={onBlur}
                                                                        options={countryCodeList}
                                                                        getOptionLabel={(option: any) => option.label}
                                                                        renderInput={(params) => <TextField {...params} label="Exp" error={!!error} />}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 8 }}>
                                                            <Controller
                                                                name='phoneNumber'
                                                                control={control}
                                                                rules={{ required: 'Phone required', pattern: { value: PHONE_REGEX, message: 'Invalid format' } }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField
                                                                        {...field}
                                                                        fullWidth
                                                                        label="Whatsapp Phone"
                                                                        error={!!error}
                                                                        helperText={error?.message}
                                                                        InputProps={{ startAdornment: <InputAdornment position="start"><Call size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                {/* Row 2: Email, DOB, Gender */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name='email'
                                                        control={control}
                                                        rules={{
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: EMAIL_REGEX,
                                                                message: "Invalid Email"
                                                            }
                                                        }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Email"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="dob"
                                                        control={control}
                                                        rules={{ required: "Date of Birth is required" }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                type="date"
                                                                label="Date of Birth"
                                                                InputLabelProps={{ shrink: true }}
                                                                error={!!error?.message}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="gender"
                                                        control={control}
                                                        rules={{ required: "Gender is required" }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <Box>
                                                                <FormLabel sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 0.5, display: 'block', color: theme.palette.text.secondary }}>Gender</FormLabel>
                                                                <RadioGroup row {...field}>
                                                                    <FormControlLabel value={"Male"} control={<Radio size="small" />} label={<Typography variant="body2">Male</Typography>} />
                                                                    <FormControlLabel value={"Female"} control={<Radio size="small" />} label={<Typography variant="body2">Female</Typography>} />
                                                                </RadioGroup>
                                                                <FormHelperText error>{error?.message}</FormHelperText>
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Row 3: Marital Status, Spouse Name (conditional) */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name='isMarriage'
                                                        control={control}
                                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                            <Box>
                                                                <FormLabel sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 0.5, display: 'block', color: theme.palette.text.secondary }}>Marital Status</FormLabel>
                                                                <RadioGroup
                                                                    row
                                                                    value={value}
                                                                    onChange={(_, newVal) => {
                                                                        console.log(newVal);
                                                                        onChange(newVal === 'true' ? true : false);
                                                                    }}
                                                                >
                                                                    <FormControlLabel value={true} control={<Radio size="small" />} label={<Typography variant="body2">Married</Typography>} />
                                                                    <FormControlLabel value={false} control={<Radio size="small" />} label={<Typography variant="body2">Unmarried</Typography>} />
                                                                </RadioGroup>
                                                                <FormHelperText error>{error?.message}</FormHelperText>
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>
                                                {isMarriage &&
                                                    <Grid size={{ xs: 12, sm: 4 }}>
                                                        <Controller
                                                            name='husbandName'
                                                            control={control}
                                                            rules={getValues('isMarriage') ? { required: "Spouse Name is required" } : undefined}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    label="Spouse's Name"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    {/* ══════════════════════════════════════════════════════
                                        Section 3: Family Roots
                                       ══════════════════════════════════════════════════════ */}
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={sectionCardSx}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <Call size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Family Roots</Typography>
                                                    <Typography variant="caption" color="text.secondary">Parent details and emergency contacts</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5}>
                                                <Grid size={{ xs: 12, sm: 12 }}>
                                                    <Grid container spacing={1.5}>
                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <Controller
                                                                name="fatherName"
                                                                control={control}
                                                                rules={{ required: 'Father Name is required' }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} fullWidth label="Father's Full Name" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <Controller
                                                                name="fatherPhone"
                                                                control={control}
                                                                rules={{ required: 'Father Phone required', pattern: { value: PHONE_REGEX, message: 'Invalid format' } }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} fullWidth label="Father's Contact" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid>
                                                        {/* <Grid size={{ xs: 12 }}>
                                                            <Controller
                                                                name="fatherIdNumber"
                                                                control={control}
                                                                rules={{ required: 'Father ID Number required' }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} fullWidth label="Father's ID Number" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid> */}
                                                        <Grid size={{ xs: 12 }}>
                                                            <Controller
                                                                name="fatherAddress"
                                                                control={control}
                                                                rules={{ required: 'Father Address required' }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} multiline rows={4} fullWidth label="Father's Address" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid>
                                                        {/* <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Controller
                                                                name="motherIdNumber"
                                                                control={control}
                                                                rules={{ required: 'Mother ID Number required' }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} fullWidth label="Mother's ID Number" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Controller
                                                                name="motherAddress"
                                                                control={control}
                                                                rules={{ required: 'Mother Address required' }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField {...field} multiline rows={4} fullWidth label="Mother's Address" error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        </Grid> */}
                                                    </Grid>
                                                </Grid>
                                                {/* <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Stack spacing={2}>
                                                        <Controller
                                                            name="fatherIdPhoto"
                                                            control={control}
                                                            // rules={{ required: 'Father ID Photo required' }}
                                                            render={({ field: { value, onChange } }) => (
                                                                <FileUpload
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    accept="image/*"
                                                                    maxSize={2097152} // 2MB
                                                                    label="Father's ID Photo (Optional)"
                                                                // error={!!error}
                                                                // helperText={error?.message}
                                                                />
                                                            )}
                                                        />
                                                        <Controller
                                                            name="motherIdPhoto"
                                                            control={control}
                                                            // rules={{ required: 'Mother ID Photo required' }}
                                                            render={({ field: { value, onChange } }) => (
                                                                <FileUpload
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    accept="image/*"
                                                                    maxSize={2097152} // 2MB
                                                                    label="Mother's ID Photo (Optional)"
                                                                // error={!!error}
                                                                // helperText={error?.message}
                                                                />
                                                            )}
                                                        />
                                                    </Stack>
                                                </Grid> */}
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    {/* ══════════════════════════════════════════════════════
                                        Section 4 & 5: Professional + References (side by side)
                                       ══════════════════════════════════════════════════════ */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ ...sectionCardSx, height: '100%' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <Briefcase size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Professional Background</Typography>
                                                    <Typography variant="caption" color="text.secondary">Work history & compensation</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name='qualification'
                                                        control={control}
                                                        rules={{ required: 'Qualification is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label='Qualification'
                                                                error={!!error?.message}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name="salary"
                                                        control={control}
                                                        rules={{ required: 'Salary is required', pattern: { value: /^\d*(\.\d{0,2})?$/i, message: 'Invalid salary' } }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label="Agreed Monthly Salary"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{ startAdornment: <InputAdornment position="start"><Wallet size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name="experience"
                                                        control={control}
                                                        rules={{ required: 'Experience required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Work Experience (in Years)" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name="pastWorking"
                                                        control={control}
                                                        rules={{ required: 'Past Working facts required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Last Organization" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ ...sectionCardSx, height: '100%' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <People size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Endorsements & References</Typography>
                                                    <Typography variant="caption" color="text.secondary">Third-party verification contacts</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name="refName"
                                                        control={control}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Reference Name" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name="refPhone"
                                                        control={control}
                                                        rules={{ pattern: { value: /^\d{10}$/, message: "Reference Phone must be 10 digits" } }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Reference Contact Number" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    {/* ══════════════════════════════════════════════════════
                                        Section 6: Residential Address
                                       ══════════════════════════════════════════════════════ */}
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={sectionCardSx}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                                    <Location size={22} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Residential Address</Typography>
                                                    <Typography variant="caption" color="text.secondary">Current and permanent residence details</Typography>
                                                </Box>
                                            </Stack>
                                            <Grid container spacing={2.5}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="stateID"
                                                        control={control}
                                                        rules={{ required: 'State is required' }}
                                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                            <Autocomplete
                                                                value={statesList.find((state: any) => state.id === value) || null}
                                                                onChange={(_, newValue) => onChange(newValue ? newValue.id : null)}
                                                                onBlur={onBlur}
                                                                options={statesList}
                                                                getOptionLabel={(option: any) => option.name}
                                                                isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="State"
                                                                        error={!!error}
                                                                        helperText={error?.message}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                            startAdornment: (
                                                                                <>
                                                                                    <InputAdornment position="start" sx={{ pl: 0.5 }}><Map size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                                                    {params.InputProps.startAdornment}
                                                                                </>
                                                                            )
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="localAddress"
                                                        control={control}
                                                        rules={{ required: 'Local Address is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                label="Current Local Address"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="permanentAddress"
                                                        control={control}
                                                        rules={{ required: 'Permanent Address is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                label="Home / Permanent Address"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                </>)}

                                {/* ══════════════════════════════════════════════════════
                                    Section 7: Financial Settings Toggle
                                   ══════════════════════════════════════════════════════ */}
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3, border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}` }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ p: 1, bgcolor: theme.palette.primary.main, borderRadius: 1.5, display: 'flex', color: '#fff' }}><Bank size={20} variant="Bold" /></Box>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>Financial Settlement Records</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {!isAdmin && isFormActive
                                                            ? 'Bank account details for salary transfers.'
                                                            : 'Toggle to capture or update bank account details for salary transfers.'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            {/* Hide toggle for non-admin when form is active — bank details are always visible */}
                                            {!(!isAdmin && isFormActive) && (
                                                <Switch
                                                    checked={isShowBankDetail}
                                                    onChange={(e) => setIsShowBankDetail(e.target.checked)}
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                </Grid>

                                {/* ══════════════════════════════════════════════════════
                                    Section 8: Bank Information (Conditional)
                                   ══════════════════════════════════════════════════════ */}
                                {showBankDetail && (
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={sectionCardSx}>
                                            <Grid container spacing={2.5}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="accountType"
                                                        control={control}
                                                        rules={{ required: 'Account Type is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <Box sx={{ p: 1, px: 2, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                                <FormLabel sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block' }}>Account Type</FormLabel>
                                                                <RadioGroup row {...field}>
                                                                    <FormControlLabel value="saving" control={<Radio size="small" />} label={<Typography variant="body2">Savings Account</Typography>} sx={{ mr: 4 }} />
                                                                    <FormControlLabel value="current" control={<Radio size="small" />} label={<Typography variant="body2">Current Account</Typography>} />
                                                                </RadioGroup>
                                                                <FormHelperText error>{error?.message}</FormHelperText>
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}></Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="accountNumber"
                                                        control={control}
                                                        rules={{ required: 'Account Number required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Bank Account Number" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="reEnterAccountNumber"
                                                        control={control}
                                                        rules={{
                                                            required: 'Verification required',
                                                            validate: (val) => val === getValues('accountNumber') || 'Account Numbers do not match'
                                                        }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Verify Account Number" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name='bankBranch'
                                                        control={control}
                                                        rules={{ required: 'Bank Branch is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                disabled
                                                                label='Bank Branch'
                                                                error={!!error?.message}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Controller
                                                        name="ifscCode"
                                                        control={control}
                                                        rules={{
                                                            required: 'IFSC Code is required',
                                                            pattern: {
                                                                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                                                message: 'Invalid IFSC format (e.g. SBIN0001234)'
                                                            },
                                                            validate: handleIfscVerify
                                                        }}
                                                        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error, isValidating } }) => (
                                                            <TextField
                                                                value={value}
                                                                onChange={(e) => {
                                                                    // Auto-uppercase for convenience
                                                                    onChange(e.target.value.toUpperCase());
                                                                }}
                                                                onBlur={onBlur}
                                                                inputRef={ref}
                                                                fullWidth
                                                                label="Bank IFSC Code"
                                                                placeholder="e.g. SBIN0001234"
                                                                error={!!error}
                                                                helperText={
                                                                    error?.message ||
                                                                    (ifscVerified === true ? '✓ IFSC verified successfully' : '')
                                                                }
                                                                FormHelperTextProps={{
                                                                    sx: {
                                                                        color: !error && ifscVerified === true
                                                                            ? 'success.main'
                                                                            : undefined
                                                                    }
                                                                }}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Bank size={18} color={theme.palette.text.disabled} />
                                                                        </InputAdornment>
                                                                    ),
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            {isValidating ? (
                                                                                <Tooltip title="Verifying IFSC...">
                                                                                    <CircularProgress size={18} />
                                                                                </Tooltip>
                                                                            ) : ifscVerified === true ? (
                                                                                <Tooltip title="IFSC Verified">
                                                                                    <ShieldTick
                                                                                        size={20}
                                                                                        variant="Bold"
                                                                                        color={theme.palette.success.main}
                                                                                    />
                                                                                </Tooltip>
                                                                            ) : ifscVerified === false ? (
                                                                                <Tooltip title="IFSC Not Found">
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: 20,
                                                                                            height: 20,
                                                                                            borderRadius: '50%',
                                                                                            bgcolor: 'error.main',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'center',
                                                                                        }}
                                                                                    >
                                                                                        <Typography
                                                                                            variant="caption"
                                                                                            sx={{ color: '#fff', lineHeight: 1, fontWeight: 700 }}
                                                                                        >
                                                                                            ✕
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                            ) : null}
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <Controller
                                                        name='accountHolderName'
                                                        control={control}
                                                        rules={{ required: 'Holder Name required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField {...field} fullWidth label="Account Holder Name" error={!!error} helperText={error?.message} />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                        {/* ── Footer Actions ───────────────────────────────────── */}
                        <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.02), borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 2, borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                            <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ minWidth: 100, borderRadius: 2 }}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{
                                    minWidth: 160,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                                    '&:hover': {
                                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isSubmitting ? 'Saving...' : isBankOnlyMode ? 'Save Bank Details' : mode === 'add' ? isStaffFound === true && !isAdmin ? 'Save Bank Details' : 'Register Staff' : 'Update Profile'}
                            </Button>
                        </Box>
                    </MainCard>
                </form>
            }
        </>
    );
};

export default AddEditStaff;
