import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { CloseCircle } from "iconsax-reactjs";

// ─── Types ──────────────────────────────────────────────────────────────────────
type ViewDetailModalProps = {
    title: string;
    open: boolean;
    detail: Record<string, any> | Record<string, any>[] | null | undefined;
    submitButtonTitle?: string;
    handleClose: () => void;
    handleSubmit?: () => void;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const formatKey = (key: string) =>
    key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase())
        .trim();

const isObject = (val: any) =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

// ─── Single value renderer ───────────────────────────────────────────────────────
const renderValue = (val: any): React.ReactNode => {
    if (val === null || val === undefined || val === '') {
        return <Typography variant="body2" color="text.disabled">—</Typography>;
    }
    if (typeof val === 'boolean') {
        return (
            <Chip
                label={val ? 'Yes' : 'No'}
                size="small"
                color={val ? 'success' : 'default'}
                variant="outlined"
            />
        );
    }
    if (Array.isArray(val)) {
        if (val.length === 0) {
            return <Typography variant="body2" color="text.disabled">—</Typography>;
        }
        return (
            <Stack spacing={1} sx={{ mt: 0.5 }}>
                {val.map((item, i) =>
                    isObject(item) ? (
                        <Box
                            key={i}
                            sx={{ pl: 1.5, borderLeft: '2px solid', borderColor: 'divider' }}
                        >
                            <ObjectRows data={item} />
                        </Box>
                    ) : (
                        <Chip key={i} label={String(item)} size="small" variant="outlined" />
                    )
                )}
            </Stack>
        );
    }
    if (isObject(val)) {
        return (
            <Box sx={{ pl: 1.5, borderLeft: '2px solid', borderColor: 'divider', mt: 0.5 }}>
                <ObjectRows data={val} />
            </Box>
        );
    }
    return (
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {String(val)}
        </Typography>
    );
};

// ─── Key-value pair row ──────────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.25, sm: 2 }}
        sx={{ py: 1.25 }}
        alignItems={{ sm: 'flex-start' }}
    >
        <Typography
            variant="body1"
            color="text.primary"
            sx={{ minWidth: 150, fontWeight: 500, flexShrink: 0 }}
        >
            {label}
        </Typography>
        <Box sx={{ flex: 1 }}>{renderValue(value)}</Box>
    </Stack>
);

// ─── Object renderer (recursive) ────────────────────────────────────────────────
const ObjectRows = ({ data }: { data: Record<string, any> }) => (
    <>
        {Object.entries(data).map(([key, val], i) => (
            <DetailRow key={i} label={formatKey(key)} value={val} />
        ))}
    </>
);

// ─── Array renderer ─────────────────────────────────────────────────────────────
const ArrayRows = ({ data }: { data: Record<string, any>[] }) => (
    <Stack spacing={2}>
        {data.map((item, i) => (
            <Box key={i}>
                {data.length > 1 && (
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                        Item {i + 1}
                    </Typography>
                )}
                <ObjectRows data={item} />
                {i < data.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
        ))}
    </Stack>
);

// ─── Main Modal ─────────────────────────────────────────────────────────────────
const ViewDetailModal = ({
    title,
    open,
    detail,
    submitButtonTitle = 'Confirm',
    handleClose,
    handleSubmit,
}: ViewDetailModalProps) => {
    const isArray = Array.isArray(detail);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <DialogTitle sx={{ p: 0 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3, py: 2 }}
                >
                    <Typography variant="h4" fontWeight={600}>{title}</Typography>
                    <IconButton size="small" onClick={handleClose} aria-label="close">
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>

            {/* ── Content ────────────────────────────────────────────────── */}
            <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
                {!detail || (isArray && (detail as any[]).length === 0) ? (
                    <Typography
                        variant="body2"
                        color="text.disabled"
                        textAlign="center"
                        sx={{ py: 4 }}
                    >
                        No details to display.
                    </Typography>
                ) : isArray ? (
                    <ArrayRows data={detail as Record<string, any>[]} />
                ) : (
                    <ObjectRows data={detail as Record<string, any>} />
                )}
            </DialogContent>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Close
                </Button>
                {handleSubmit && (
                    <Button variant="contained" onClick={handleSubmit}>
                        {submitButtonTitle}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ViewDetailModal;
