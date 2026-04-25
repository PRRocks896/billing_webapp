import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { CloseCircle, Receipt21, Money, Card, Moneys } from "iconsax-reactjs";
import usePaymentModal, { PaymentDetailItem } from "pages/bill/hooks/usePaymentModal";

// ─── Payment Row ─────────────────────────────────────────────────────────────────
const PaymentRow = ({
    item,
    onToggle,
    onAmountChange,
    onCardNoChange,
}: {
    item: PaymentDetailItem;
    onToggle: (id: string | number, value: boolean) => void;
    onAmountChange: (id: string | number, value: string) => void;
    onCardNoChange: (id: string | number, value: string) => void;
}) => {
    const isCard = typeof item.cardNo === 'string';

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: item.enabled ? 'primary.main' : 'divider',
                bgcolor: item.enabled ? 'primary.lighter' : 'transparent',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Checkbox + Label */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 140, flex: '1 1 140px' }}>
                <Checkbox
                    checked={item.enabled}
                    onChange={(e) => onToggle(item.id, e.target.checked)}
                    size="small"
                    sx={{ p: 0.5 }}
                />
                <Typography variant="body2" fontWeight={item.enabled ? 600 : 400}>
                    {item.name}
                </Typography>
            </Stack>

            {/* Amount Field */}
            <TextField
                size="small"
                label="Amount"
                type="number"
                disabled={!item.enabled}
                value={item.amount === 0 ? '' : item.amount}
                onChange={(e) => onAmountChange(item.id, e.target.value)}
                sx={{ width: { xs: '100%', sm: 160 }, flex: '1 1 160px' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0 }}
            />

            {/* Card Number Field (only for Card type) */}
            {isCard && (
                <TextField
                    size="small"
                    label="Last 4 Digits"
                    type="text"
                    disabled={!item.enabled}
                    value={item.cardNo ?? ''}
                    onChange={(e) => onCardNoChange(item.id, e.target.value)}
                    sx={{ width: { xs: '100%', sm: 120 }, flex: '1 1 120px' }}
                    inputProps={{ maxLength: 4 }}
                    placeholder="XXXX"
                />
            )}
        </Box>
    );
};

// ─── Props ────────────────────────────────────────────────────────────────────────
type PaymentModalProps = {
    open: boolean;
    grandTotal: number | string | null;
    onClose: () => void;
    onConfirm: (payments: PaymentDetailItem[]) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────────
const PaymentModal = ({ open, grandTotal, onClose, onConfirm }: PaymentModalProps) => {
    const {
        paymentDetail,
        totalEntered,
        loading,
        error,
        dispatch,
        handleConfirm,
        handleClose,
    } = usePaymentModal({ open, grandTotal, onConfirm, onClose });

    const remaining =
        grandTotal !== null ? parseFloat(String(grandTotal)) - totalEntered : null;

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
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Receipt21 size={22} />
                        <Typography variant="h5" fontWeight={600}>
                            Payment Details
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={handleClose} aria-label="close">
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                <br />
                {/* Grand Total info */}
                {/* {grandTotal !== null && (
                    <Box
                        sx={{
                            mb: 2.5,
                            p: 2,
                            borderRadius: 1.5,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="subtitle2">Grand Total to Collect</Typography>
                        <Typography variant="h5" fontWeight={700}>₹ {grandTotal}/-</Typography>
                    </Box>
                )} */}

                {/* Payment type rows */}
                <Stack spacing={1.5}>
                    {loading ? (
                        // Loading skeletons
                        [1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" height={58} />
                        ))
                    ) : paymentDetail && paymentDetail.length > 0 ? (
                        paymentDetail.map((item) => (
                            <PaymentRow
                                key={item.id}
                                item={item}
                                onToggle={(id, value) =>
                                    dispatch({ type: 'SET_CHECKBOX', payload: { id, value } })
                                }
                                onAmountChange={(id, value) =>
                                    dispatch({ type: 'SET_AMOUNT', payload: { id, value } })
                                }
                                onCardNoChange={(id, value) =>
                                    dispatch({ type: 'SET_CARD_NO', payload: { id, value } })
                                }
                            />
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ py: 3 }}
                        >
                            No payment types available.
                        </Typography>
                    )}
                </Stack>

                {/* Totals summary */}
                {paymentDetail && paymentDetail.length > 0 && (
                    <Box sx={{ mt: 2.5 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                            <Typography variant="body2" color="text.secondary">Amount Entered</Typography>
                            <Typography variant="body2" fontWeight={600}>₹ {totalEntered.toFixed(2)}</Typography>
                        </Stack>
                        {remaining !== null && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Remaining</Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color={remaining === 0 ? 'success.main' : remaining > 0 ? 'warning.main' : 'error.main'}
                                >
                                    ₹ {remaining.toFixed(2)}
                                </Typography>
                            </Stack>
                        )}
                    </Box>
                )}

                {/* Validation error */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <DialogActions sx={{ px: 3, py: 2.5 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={loading || !paymentDetail || paymentDetail.length === 0}
                >
                    Confirm Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentModal;