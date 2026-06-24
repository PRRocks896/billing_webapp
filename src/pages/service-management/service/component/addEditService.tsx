import { Controller } from 'react-hook-form';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import UseAddEditService from "../hooks/useAddEditService";
import Autocomplete from '@mui/material/Autocomplete';
import { generateSlug } from 'utils/helper';
import FileUpload from 'components/FileUpload';
import IconButton from '@mui/material/IconButton';
import { AddCircle, Trash, Box1, Receipt1, Gallery, DocumentText, TaskSquare, MessageQuestion, Save2, ArrowLeft } from 'iconsax-reactjs';
import Switch from '@mui/material/Switch';

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', ml: 1 }} />
    </Stack>
);

const AddEditService = () => {
    const {
        mode,
        title,
        control,
        faqFields,
        isSubmitting,
        scrubsFields,
        isWebDisplay,
        featureListFields,
        recommendedFields,
        serviceCategories,
        therapyOptionsFields,
        durationAndPriceFields,
        addRow,
        setValue,
        onSubmit,
        getValues,
        removeRow,
        addFaqRow,
        handleBack,
        removeFaqRow,
        handleSubmit,
        addScrubsRow,
        removeScrubsRow,
        addRecommendedRow,
        removeRecommendedRow,
        addTherapyOptionsRow,
        addDurationAndPriceRow,
        removeTherapyOptionsRow,
        removeDurationAndPriceRow
    } = UseAddEditService();

    return (
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}>
            <Grid container spacing={3}>

                {/* ── Main Form Column ───────────────────────────────────────── */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={3}>

                        {/* ── Section 1: Basic Details ──────────────────────────── */}
                        <MainCard>
                            <SectionHeader icon={<Box1 size={18} />} label="Basic Details" />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 12 }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Service Name is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => {
                                                    onChange(e.target.value.toUpperCase());
                                                    setValue("slug", generateSlug(e.target.value));
                                                }}
                                                onBlur={onBlur}
                                                fullWidth
                                                label="Service Name*"
                                                placeholder="Enter Service Name"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                {isWebDisplay &&
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='slug'
                                            control={control}
                                            rules={{ required: 'Slug is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    fullWidth
                                                    label="Slug"
                                                    placeholder="Enter Slug"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                }
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 12 }}>
                                    <Controller
                                        name="service_category_id"
                                        control={control}
                                        rules={{ required: 'Service Category is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <Autocomplete
                                                value={serviceCategories.find((category: any) => category.id === value) || null}
                                                onChange={(_, newValue: any) => onChange(newValue ? newValue.id : null)}
                                                onBlur={onBlur}
                                                options={serviceCategories}
                                                getOptionLabel={(option: any) => option.name}
                                                isOptionEqualToValue={(option: any, val: any) => option.id === val}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Service Category*"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                {isWebDisplay &&
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='displayName'
                                            control={control}
                                            rules={{ required: "Display name is required" }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                    onBlur={onBlur}
                                                    fullWidth
                                                    label="Display Name*"
                                                    placeholder="Enter Display Name"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </MainCard>

                        {/* ── Section 2: Pricing & Duration ─────────────────────── */}
                        <MainCard>
                            <SectionHeader icon={<Receipt1 size={18} />} label="Pricing & Duration" />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 4 }}>
                                    <Controller
                                        name='amount'
                                        control={control}
                                        rules={{ required: 'Amount is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                fullWidth
                                                label="Amount*"
                                                placeholder="0.00"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {isWebDisplay &&
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='webPrice'
                                            control={control}
                                            rules={{
                                                required: "Web price is required",
                                                pattern: { value: /^\d*(\.\d{0,2})?$/i, message: "Please enter digit only." }
                                            }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                    onBlur={onBlur}
                                                    fullWidth
                                                    label="Web Price*"
                                                    placeholder="0.00"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                }
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 4 }}>
                                    <Controller
                                        name='hsnCode'
                                        control={control}
                                        rules={{ required: 'HSN Code is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                fullWidth
                                                label="HSN Code*"
                                                placeholder="Enter HSN Code"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 4 }}>
                                    <Controller
                                        name='minutes'
                                        control={control}
                                        rules={{ required: 'Minutes is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                fullWidth
                                                label="Duration (Minutes)*"
                                                placeholder="e.g. 60"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">min</InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: isWebDisplay ? 6 : 4 }}>

                                    <Controller
                                        name='isWebDisplay'
                                        control={control}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <>
                                                <Switch
                                                    checked={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                />
                                                <Typography variant="body2">Web Display</Typography>
                                            </>
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </MainCard>

                        {/* ── Section 3: Description & FAQ ──────────────────────── */}
                        {isWebDisplay &&
                            <MainCard>
                                <SectionHeader icon={<DocumentText size={18} />} label="Description" />
                                <Controller
                                    name='h1Tag'
                                    control={control}
                                    rules={{ required: "H1 Tag is required" }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            sx={{ mb: 2 }}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="H1 Tag"
                                            placeholder="Enter H1 Tag"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name='description'
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Service Description*"
                                            placeholder="Detailed description of the service..."
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </MainCard>
                        }

                        {/* ── Section 4: Service Attributes & Lists ─────────────── */}
                        {isWebDisplay &&
                            <MainCard>
                                <SectionHeader icon={<TaskSquare size={18} />} label="Service Attributes" />
                                <Grid container spacing={3}>
                                    {/* Feature List */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Feature List</Typography>
                                        {featureListFields.fields.map((field, index) => (
                                            <Stack direction="row" spacing={1} key={field.id} alignItems="center" sx={{ mb: 1.5 }}>
                                                <Controller
                                                    name={`featureList.${index}.value`}
                                                    control={control}
                                                    rules={{ required: "Feature is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Feature"
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                                <Stack direction="row">
                                                    {featureListFields.fields.length !== 1 && (
                                                        <IconButton color="error" size="small" onClick={() => removeRow(index)}><Trash size={18} /></IconButton>
                                                    )}
                                                    {featureListFields.fields.length === (index + 1) && (
                                                        <IconButton color="primary" size="small" onClick={addRow}><AddCircle size={18} /></IconButton>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Grid>

                                    {/* Recommended For */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Recommended For</Typography>
                                        {recommendedFields.fields.map((field, index) => (
                                            <Stack direction="row" spacing={1} key={field.id} alignItems="center" sx={{ mb: 1.5 }}>
                                                <Controller
                                                    name={`recommended.${index}.value`}
                                                    control={control}
                                                    rules={{ required: "Recommended For is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Recommended For"
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                                <Stack direction="row">
                                                    {recommendedFields.fields.length !== 1 && (
                                                        <IconButton color="error" size="small" onClick={() => removeRecommendedRow(index)}><Trash size={18} /></IconButton>
                                                    )}
                                                    {recommendedFields.fields.length === (index + 1) && (
                                                        <IconButton color="primary" size="small" onClick={addRecommendedRow}><AddCircle size={18} /></IconButton>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Grid>

                                    {/* Scrub */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Scrub</Typography>
                                        {scrubsFields.fields.map((field, index) => (
                                            <Stack direction="row" spacing={1} key={field.id} alignItems="center" sx={{ mb: 1.5 }}>
                                                <Controller
                                                    name={`scrubs.${index}.value`}
                                                    control={control}
                                                    rules={{ required: "Scrub is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Scrub"
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                                <Stack direction="row">
                                                    {scrubsFields.fields.length !== 1 && (
                                                        <IconButton color="error" size="small" onClick={() => removeScrubsRow(index)}><Trash size={18} /></IconButton>
                                                    )}
                                                    {scrubsFields.fields.length === (index + 1) && (
                                                        <IconButton color="primary" size="small" onClick={addScrubsRow}><AddCircle size={18} /></IconButton>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Grid>

                                    {/* Therapy Options */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Therapy Options</Typography>
                                        {therapyOptionsFields.fields.map((field, index) => (
                                            <Stack direction="row" spacing={1} key={field.id} alignItems="center" sx={{ mb: 1.5 }}>
                                                <Controller
                                                    name={`therapyOptions.${index}.value`}
                                                    control={control}
                                                    rules={{ required: "Therapy Option is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Therapy Option"
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                                <Stack direction="row">
                                                    {therapyOptionsFields.fields.length !== 1 && (
                                                        <IconButton color="error" size="small" onClick={() => removeTherapyOptionsRow(index)}><Trash size={18} /></IconButton>
                                                    )}
                                                    {therapyOptionsFields.fields.length === (index + 1) && (
                                                        <IconButton color="primary" size="small" onClick={addTherapyOptionsRow}><AddCircle size={18} /></IconButton>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Grid>

                                    {/* Duration and Price */}
                                    <Grid size={{ xs: 12, md: 12 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Duration and Price</Typography>
                                        {durationAndPriceFields.fields.map((field, index) => (
                                            <Stack direction="row" spacing={1} key={field.id} alignItems="center" sx={{ mb: 1.5 }}>
                                                <Controller
                                                    name={`durationAndPrice.${index}.duration`}
                                                    control={control}
                                                    rules={{ required: "Duration is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Duration"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">Mins</InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name={`durationAndPrice.${index}.price`}
                                                    control={control}
                                                    rules={{
                                                        required: "Price is required",
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: "Please enter a valid number"
                                                        }
                                                    }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Price"
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name={`durationAndPrice.${index}.discountedPrice`}
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => {
                                                            const price = getValues(`durationAndPrice.${index}.price`);
                                                            if (value && Number(value) >= Number(price)) {
                                                                return "Discounted Price must be less than Price";
                                                            }
                                                            return true;
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: "Please enter a valid number"
                                                        }
                                                    }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            placeholder="Enter Discounted Price"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                                <Stack direction="row">
                                                    {durationAndPriceFields.fields.length !== 1 && (
                                                        <IconButton color="error" size="small" onClick={() => removeDurationAndPriceRow(index)}><Trash size={18} /></IconButton>
                                                    )}
                                                    {durationAndPriceFields.fields.length === (index + 1) && (
                                                        <IconButton color="primary" size="small" onClick={addDurationAndPriceRow}><AddCircle size={18} /></IconButton>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Grid>
                                </Grid>
                            </MainCard>
                        }

                        {/* ── Section 5: FAQ ────────────────────────────────────── */}
                        {isWebDisplay &&
                            <MainCard>
                                <SectionHeader icon={<MessageQuestion size={18} />} label="Frequently Asked Questions" />
                                <Stack spacing={2}>
                                    {faqFields.fields.map((field, index) => (
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} key={field.id} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
                                            <Box flex={1}>
                                                <Controller
                                                    name={`faq.${index}.title`}
                                                    control={control}
                                                    rules={{ required: "Title is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            label="Question"
                                                            placeholder="Enter Question Title"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box flex={2}>
                                                <Controller
                                                    name={`faq.${index}.description`}
                                                    control={control}
                                                    rules={{ required: "Description is required" }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <TextField
                                                            size='small'
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            label="Answer"
                                                            placeholder="Enter Detailed Answer"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Stack direction="row" spacing={0.5} sx={{ pt: { xs: 0, sm: 0.5 }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                                                {faqFields.fields.length !== 1 && (
                                                    <IconButton color="error" size="small" onClick={() => removeFaqRow(index)}><Trash size={20} /></IconButton>
                                                )}
                                                {faqFields.fields.length === (index + 1) && (
                                                    <IconButton color="primary" size="small" onClick={addFaqRow}><AddCircle size={20} /></IconButton>
                                                )}
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </MainCard>
                        }

                    </Stack>
                </Grid>

                {/* ── Media Assets & Actions Column ──────────────────────────── */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Box sx={{ position: { xs: 'static', lg: 'sticky' }, top: 88 }}>

                        {isWebDisplay && <MainCard sx={{ mb: 3 }}>
                            <SectionHeader icon={<Gallery size={18} />} label="Media Assets" />
                            <Stack spacing={3}>
                                <Controller
                                    name='thumbnilImage'
                                    control={control}
                                    rules={{ required: "Thumbail image is required" }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value}
                                            onChange={onChange}
                                            accept="image/*"
                                            maxSize={2097152} // 2MB
                                            label="Thumbnail Image (Required)"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name='images'
                                    control={control}
                                    rules={{ required: "Images is required" }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value}
                                            onChange={onChange}
                                            accept="image/*"
                                            maxSize={2097152} // 2MB
                                            label="Gallery Images (Multiple)"
                                            multiple={true}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name='backgrandImage'
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value}
                                            onChange={onChange}
                                            accept="image/*"
                                            maxSize={2097152} // 2MB
                                            label="Background Image"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name='video'
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value}
                                            onChange={onChange}
                                            accept="video/*"
                                            maxSize={2097152} // 2MB
                                            label="Video Presentation"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Stack>
                        </MainCard>}

                        {/* Actions */}
                        <MainCard>
                            <Stack spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<Save2 size={18} />}
                                    disabled={isSubmitting}
                                >
                                    {mode === 'add' ? (isSubmitting ? 'Adding...' : 'Add Service') : (isSubmitting ? 'Updating...' : 'Update Service')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    color="secondary"
                                    startIcon={<ArrowLeft size={18} />}
                                    onClick={handleBack}
                                >
                                    Cancel & Go Back
                                </Button>
                            </Stack>
                        </MainCard>

                    </Box>
                </Grid>

            </Grid>
        </form>
    );
};

export default AddEditService;