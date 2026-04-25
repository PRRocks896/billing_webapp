import { useEffect, useMemo, useReducer, useState } from "react";
import { getPaymentTypeList } from "service/payment-type";
import { listPayload } from "utils/helper";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type PaymentDetailItem = {
    id: string | number;
    name: string;
    amount: number;
    enabled: boolean;
    cardNo?: string;           // only present for Card type
};

type PaymentState = {
    detail: PaymentDetailItem[] | null;
};

type PaymentAction =
    | { type: 'SET_DETAILS'; payload: any[] }
    | { type: 'SET_CHECKBOX'; payload: { id: string | number; value: boolean } }
    | { type: 'SET_AMOUNT'; payload: { id: string | number; value: string } }
    | { type: 'SET_CARD_NO'; payload: { id: string | number; value: string } }
    | { type: 'RESET' };

// ─── Reducer ────────────────────────────────────────────────────────────────────
const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const paymentDetailReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
    switch (action.type) {
        case 'SET_DETAILS': {
            const detail: PaymentDetailItem[] = action.payload.map((item) => {
                const base: PaymentDetailItem = {
                    name: capitalizeFirstLetter(`${item.name} Sale`),
                    amount: 0,
                    enabled: false,
                    id: item.id,
                };
                if (['CARD', 'card', 'Card'].includes(item.name)) {
                    base.cardNo = '';
                }
                return base;
            });
            return { ...state, detail };
        }
        case 'SET_CHECKBOX': {
            if (!state.detail) return state;
            const updated = state.detail.map((item) =>
                item.id === action.payload.id ? { ...item, enabled: action.payload.value } : item
            );
            return { ...state, detail: updated };
        }
        case 'SET_AMOUNT': {
            if (!state.detail) return state;
            const updated = state.detail.map((item) =>
                item.id === action.payload.id ? { ...item, amount: parseFloat(action.payload.value) || 0 } : item
            );
            return { ...state, detail: updated };
        }
        case 'SET_CARD_NO': {
            if (!state.detail) return state;
            const updated = state.detail.map((item) =>
                item.id === action.payload.id ? { ...item, cardNo: action.payload.value } : item
            );
            return { ...state, detail: updated };
        }
        case 'RESET':
            return { detail: null };
        default:
            return state;
    }
};

// ─── Hook Props ─────────────────────────────────────────────────────────────────
type UsePaymentModalProps = {
    open: boolean;
    grandTotal: number | string | null;
    onConfirm: (payments: PaymentDetailItem[]) => void;
    onClose: () => void;
};

// ─── Hook ───────────────────────────────────────────────────────────────────────
const usePaymentModal = ({ open, grandTotal, onConfirm, onClose }: UsePaymentModalProps) => {
    const [paymentState, dispatch] = useReducer(paymentDetailReducer, { detail: null });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Sum of all entered amounts
    const totalEntered = useMemo(() => {
        return paymentState.detail?.reduce((sum, item) => sum + (item.amount || 0), 0) ?? 0;
    }, [paymentState.detail]);

    // Fetch payment types when modal opens
    useEffect(() => {
        if (!open) return;
        const fetchPaymentTypes = async () => {
            setLoading(true);
            try {
                const response: any = await getPaymentTypeList(
                    listPayload(0, { isActive: true, isDeleted: false }, 100000)
                );
                if (response?.data) {
                    dispatch({ type: 'SET_DETAILS', payload: response.data.rows ?? response.data });
                }
            } catch (err) {
                console.error('Error fetching payment types:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentTypes();
    }, [open]);

    const handleClose = () => {
        dispatch({ type: 'RESET' });
        setError('');
        onClose();
    };

    const handleConfirm = () => {
        if (!paymentState.detail) return;

        // Validate card numbers
        const cardError = paymentState.detail.find(
            (item) => item.enabled && typeof item.cardNo === 'string' && item.cardNo.length !== 4
        );
        if (cardError) {
            setError('Please enter the last 4-digit card number.');
            return;
        }

        // Validate total matches grand total
        const gt = grandTotal !== null ? parseFloat(String(grandTotal)) : null;
        if (gt !== null && totalEntered !== gt) {
            setError(`Amount entered (₹ ${totalEntered}) must match Grand Total (₹ ${gt})`);
            return;
        }

        setError('');
        const filtered = paymentState.detail.filter((item) => item.amount > 0);
        onConfirm(filtered);
        handleClose();
    };

    return {
        paymentDetail: paymentState.detail,
        totalEntered,
        loading,
        error,
        dispatch,
        handleConfirm,
        handleClose,
    };
};

export default usePaymentModal;