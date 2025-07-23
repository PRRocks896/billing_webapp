/* eslint-disable no-undef */
import React, { useMemo } from "react";
import { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    FormGroup,
    Checkbox,
    TextField,
    Button,
    Grid,
} from "@mui/material";


const PaymentDetailsModle = ({
    open,
    detail,
    okTitle = ' Confirm',
    handleOk,
    handleClose,
    handlePaymentAmount,
    grandTotal
}) => {

    const [CardEnabled, setIsCardEnabled] = useState(false);
    const [cashEnabled, setCashEnabled] = useState(false);
    const [upiEnabled, setUpiEnabled] = useState(false);
    const [cardNo, setCardNo] = useState("");

    const [cashAmount, setCashAmount] = useState("");
    const [upiAmount, setUpiAmount] = useState("");
    const [cardAmount, setCardAmount] = useState("");

    const [error, setError] = useState("");

    const handleConfirm = () => {
        const totalEntered =
            (parseFloat(cashAmount) || 0) +
            (parseFloat(upiAmount) || 0) +
            (parseFloat(cardAmount) || 0);

        if (totalEntered !== parseFloat(grandTotal)) {
            setError(`Total amount enter (${totalEntered}) must match Grand Total (${grandTotal})`);
            return;
        }

        setError("");
        handleOk();
    };

    const totalEntered = useMemo(() => {
        return (parseFloat(cashAmount) || 0) +
            (parseFloat(upiAmount) || 0) +
            (parseFloat(cardAmount) || 0);

    }, [cashAmount, upiAmount, cardAmount]);

    return (
        <Modal
            aria-labelledby="payment-breakdown-title"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <Box className="modal-wrapper modal-bg" >

                <Typography id="payment-breakdown-title" variant="h6" component="h6" sx={{ display: 'flex', justifyContent: 'space-between', }}>
                    Payment Option
                </Typography>


                <Box className="modal-wrapper" sx={{ mt: 2 }}>
                    <FormGroup>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Checkbox
                                checked={cashEnabled}
                                onChange={(e) => setCashEnabled(e.target.checked)}
                            />
                            <Typography>Cash Sale</Typography>
                            <TextField
                                size="small"
                                type="number"
                                label="Amount"
                                sx={{ width: 200 }}
                                disabled={!cashEnabled}
                                value={cashAmount}
                                onChange={(e) => { setCashAmount(e.target.value); handlePaymentAmount("cashSale", e.target.value) }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Checkbox
                                checked={upiEnabled}
                                onChange={(e) => setUpiEnabled(e.target.checked)}
                            />
                            <Typography>UPI Sale</Typography>
                            <TextField
                                size="small"
                                type="number"
                                label="Amount"
                                sx={{ width: 200 }}
                                disabled={!upiEnabled}
                                value={upiAmount}
                                onChange={(e) => { setUpiAmount(e.target.value); handlePaymentAmount("upiSale", e.target.value) }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Checkbox
                                    checked={CardEnabled}
                                    onChange={(e) => setIsCardEnabled(e.target.checked)}
                                />
                                <Typography>Card Sale</Typography>
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Amount"
                                    sx={{ width: 200 }}
                                    disabled={!CardEnabled}
                                    value={cardAmount}
                                    onChange={(e) => { setCardAmount(e.target.value); handlePaymentAmount("cardSale", e.target.value) }}
                                />
                            </Box>


                            {CardEnabled && (
                                <TextField
                                    size="small"
                                    type="text"
                                    label="Card No"
                                    inputProps={{ maxLength: 4 }}
                                    sx={{ width: 150, display: 'flex', }}
                                    value={cardNo}
                                    onChange={(e) => { setCardNo(e.target.value); handlePaymentAmount("cardNo", e.target.value) }}


                                />
                            )}

                        </Box>


                    </FormGroup>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, mr: 7, mb: 0.5 }}>

                        <Box>
                            <Typography color="black" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                Grand Total: {totalEntered}
                            </Typography>
                        </Box>

                    </Box>
                    <Box>
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>


                </Box>

                <Box className="modal-footer">
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Button className="btn btn-tertiary"
                                onClick={handleConfirm}
                            >
                                {okTitle}
                            </Button>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Button className="btn btn-cancel" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
};

export default PaymentDetailsModle;