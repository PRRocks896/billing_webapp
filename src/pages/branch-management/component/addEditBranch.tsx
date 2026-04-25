import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

// project components
import MainCard from 'components/MainCard';
import { generateSlug } from 'utils/helper';

// hooks & utils
import useAddEditBranch from "../hooks/useAddEditBranch";
import { EMAIL_REGEX, GST_REGEX, PHONE_REGEX } from 'utils/constant';

// assets
import {
    Building,
    Profile2User,
    Shop,
    Global,
    ReceiptItem,
    Location,
    Sms,
    Call,
    Lock,
    ArrowLeft,
    User,
    Link1,
    DirectboxReceive,
    Personalcard
} from 'iconsax-reactjs';
import ReactQuill from 'components/third-party/ReactQuill';
import FileUpload from 'components/FileUpload';

const AddEditBranch = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        roleOptions,
        cityOptions,
        isSubmitting,
        isWebDisplay,
        companyOptions,
        countryCodeList,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditBranch();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}` }}>
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
                            <Building size={24} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Configure branch details, billing settings, and administrator access.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ borderRadius: 2 }}
                    >
                        Back to List
                    </Button>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={4}>
                        {/* ── Section 1: Administrator Access ────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Profile2User size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Administrator Access</Typography>
                            </Stack>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        rules={{ required: 'First Name is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="First Name"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><User size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        rules={{ required: 'Last Name is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Last Name"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    // setValue("slug", generateSlug('massage-spa-in-' + e.target.value));
                                                }}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="userName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="User Name"
                                                disabled
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Personalcard size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='email'
                                        control={control}
                                        rules={{
                                            required: 'Email is required',
                                            pattern: { value: EMAIL_REGEX, message: 'Invalid email format' }
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Email Address"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Sms size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {mode === 'add' && (
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name='password'
                                            control={control}
                                            rules={{ required: 'Password is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="password"
                                                    label="Password"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><Lock size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='roleID'
                                        control={control}
                                        rules={{ required: 'Role is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                value={roleOptions.find((role: any) => role.value === value) || null}
                                                onChange={(_, newValue) => onChange(newValue ? newValue.value : null)}
                                                onBlur={onBlur}
                                                options={roleOptions}
                                                getOptionLabel={(option: any) => option.label}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Role" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 2: Branch Identity ─────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Shop size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Branch Identity</Typography>
                            </Stack>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='branchName'
                                        control={control}
                                        rules={{ required: 'Branch Name is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Branch Name"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="slug"
                                        control={control}
                                        rules={{
                                            required: 'Slug is required'
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Branch Slug"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='companyID'
                                        control={control}
                                        rules={{ required: 'Company is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                value={companyOptions.find((c: any) => c.value === value) || null}
                                                onChange={(_, newValue) => onChange(newValue ? newValue.value : null)}
                                                onBlur={onBlur}
                                                options={companyOptions}
                                                renderInput={(params) => <TextField {...params} label="Company" error={!!error} helperText={error?.message} />}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='cityID'
                                        control={control}
                                        rules={{ required: 'City is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                value={cityOptions.find((c: any) => c.value === value) || null}
                                                onChange={(_, newValue) => onChange(newValue ? newValue.value : null)}
                                                onBlur={onBlur}
                                                options={cityOptions}
                                                renderInput={(params) => <TextField {...params} label="Location/City" error={!!error} helperText={error?.message} />}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 3: Connectivity & Social ───────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Global size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Connectivity & Social</Typography>
                            </Stack>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <Controller
                                                name='countryCode'
                                                control={control}
                                                rules={{ required: 'Required' }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        fullWidth
                                                        options={countryCodeList}
                                                        value={countryCodeList.find((c: any) => c.value === value) || null}
                                                        onChange={(_, n) => onChange(n ? n.value : '')}
                                                        renderInput={(params) => <TextField {...params} label="Code" error={!!error} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 7 }}>
                                            <Controller
                                                name='phoneNumber'
                                                control={control}
                                                rules={{ required: 'Phone is required', pattern: { value: PHONE_REGEX, message: 'Invalid phone' } }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Primary Phone"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{ startAdornment: <InputAdornment position="start"><Call size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='phoneNumberSecond'
                                        control={control}
                                        rules={{ pattern: { value: PHONE_REGEX, message: 'Invalid phone' } }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Secondary Phone (Optional)"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="feedbackUrl"
                                        control={control}
                                        // rules={{ required: 'Feedback URL is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Feedback URL"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><Link1 size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="reviewUrl"
                                        control={control}
                                        // rules={{ required: 'Review URL is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Google Review URL"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 4: Billing & Compliance ────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <ReceiptItem size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Billing & Compliance</Typography>
                            </Stack>
                            <Grid container spacing={2.5} alignItems="center">
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Controller
                                        name="billCode"
                                        control={control}
                                        rules={{ required: 'Bill Code is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField {...field} fullWidth label="Bill Code" error={!!error} helperText={error?.message} />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 5 }}>
                                    <Controller
                                        name="billTitle"
                                        control={control}
                                        rules={{ required: 'Bill Title is required' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField {...field} fullWidth label="Invoice Title" error={!!error} helperText={error?.message} />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="gstNo"
                                        control={control}
                                        rules={{ required: 'GST No is required', pattern: { value: GST_REGEX, message: 'Invalid GST No' } }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField {...field} fullWidth label="GST Identification Number" error={!!error} helperText={error?.message} />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box sx={{ p: 1, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}` }}>
                                        <Controller
                                            name="isShowGst"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControlLabel
                                                    label={<Typography variant="body2" fontWeight={600}>Show GST on Invoices</Typography>}
                                                    control={<Switch checked={field.value} onChange={field.onChange} />}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 5: Physical Presence ───────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Location size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Physical Presence</Typography>
                            </Stack>
                            <Controller
                                name="address"
                                control={control}
                                rules={{ required: 'Address is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Complete Branch Address"
                                        error={!!error}
                                        helperText={error?.message}
                                        InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DirectboxReceive size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ p: 1, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}` }}>
                                <Controller
                                    name="isWebDisplay"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            label={<Typography variant="body2" fontWeight={600}>Display on Website</Typography>}
                                            control={<Switch checked={field.value} onChange={field.onChange} />}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 6: Website ───────────────────────────────────── */}
                        {isWebDisplay &&
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                    <Global size={20} color={theme.palette.primary.main} variant="Bulk" />
                                    <Typography variant="h5" fontWeight={600}>Website</Typography>
                                </Stack>
                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="areaName"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Area Name"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="h1Tag"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="H1 Tag"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <Stack spacing={1}>
                                                    <ReactQuill
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Draft the detailed narrative content here..."
                                                    />
                                                    {error && <FormHelperText error>{error.message}</FormHelperText>}
                                                </Stack>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="mapUrl"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Map URL"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="iFrameMap"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label="IFrame Map"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                        <Controller
                                            name="images"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Upload Images"
                                                    error={!!error}
                                                    multiple={true}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                        <Controller
                                            name="thumbnilImage"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Upload Thumbnil Image"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Box>

                {/* ── Footer Actions ───────────────────────────────────── */}
                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.02), borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ minWidth: 100, borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: 140,
                            borderRadius: 2,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                        }}
                    >
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Create Branch' : 'Update Details'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditBranch;