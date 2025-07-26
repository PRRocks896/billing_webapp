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
    CardContent,
    CardActions,

} from "@mui/material";

const PaymentDetailsModle = ({
    open,
    detail,
    okTitle = " Confirm",
    handleOk,
    handleClose,
    handlePaymentAmount,
    grandTotal,
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
            setError(
                `Total amount enter (${totalEntered}) must match Grand Total (${grandTotal})`
            );
            return;
        }

        setError("");
        handleOk();
    };

    const totalEntered = useMemo(() => {
        return (
            (parseFloat(cashAmount) || 0) +
            (parseFloat(upiAmount) || 0) +
            (parseFloat(cardAmount) || 0)
        );
    }, [cashAmount, upiAmount, cardAmount]);

    return (
        <Modal
            aria-labelledby="payment-breakdown-title"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 2,
                width: {
                    xs: "80%",
                    sm: "80%",
                    md: "60%",
                    lg: "50%",
                },
                maxHeight: "auto",
                overflowY: "hidden",
                mx: "auto",
                mt: 5,
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(5px)",
                },
            }}
        >

            <CardContent className="modal-wrapper modal-bg">
                <Typography
                    id="payment-breakdown-title"
                    variant="h6"
                    component="h6"
                    className="text-black modal-title"

                // sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    Payment Option
                </Typography>

                <CardContent className="modal-body" sx={{ mt: 2 }}>
                    <FormGroup>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{
                                    display: "flex",
                                    // flexWrap: "wrap",           
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                }}>
                                    <Checkbox
                                        checked={cashEnabled}
                                        onChange={(e) => setCashEnabled(e.target.checked)}
                                    />
                                    <Typography sx={{ minWidth: 90 }}>Cash Sale</Typography>
                                    <TextField
                                        size="small"
                                        type="number"
                                        label="Amount"
                                        sx={{ width: { xs: "100%", sm: 200 } }}
                                        disabled={!cashEnabled}
                                        value={cashAmount}
                                        onChange={(e) => {
                                            setCashAmount(e.target.value);
                                            handlePaymentAmount("cashSale", e.target.value);
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{
                                    display: "flex",
                                    // flexWrap: "wrap",           
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                }}>
                                    <Checkbox
                                        checked={upiEnabled}
                                        onChange={(e) => setUpiEnabled(e.target.checked)}
                                    />
                                    <Typography sx={{ minWidth: 90 }}>UPI Sale</Typography>
                                    <TextField
                                        size="small"
                                        type="number"
                                        label="Amount"
                                        sx={{ width: 200 }}
                                        disabled={!upiEnabled}
                                        value={upiAmount}
                                        onChange={(e) => {
                                            setUpiAmount(e.target.value);
                                            handlePaymentAmount("upiSale", e.target.value);
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // alignItems: "center",

                                    mb: 1,
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        flexWrap: "wrap",
                                        flex: 1,
                                        minWidth: 250,
                                    }}>
                                        <Checkbox
                                            checked={CardEnabled}
                                            onChange={(e) => setIsCardEnabled(e.target.checked)}
                                        />
                                        <Typography sx={{ minWidth: 90 }}>Card Sale</Typography>
                                        <TextField
                                            size="small"
                                            type="number"
                                            label="Amount"
                                            sx={{ width: 200 }}
                                            disabled={!CardEnabled}
                                            value={cardAmount}
                                            onChange={(e) => {
                                                setCardAmount(e.target.value);
                                                handlePaymentAmount("cardSale", e.target.value);
                                            }}


                                        />

                                        {/* </Grid> */}
                                    </Box>
                                    <Grid item xs={6} sm={6}>
                                        <Box sx={{display: 'flex',}}>
                                            {CardEnabled && (
                                                <TextField
                                                    size="small"
                                                    type="text"
                                                    label="Card No"
                                                    inputProps={{ maxLength: 4 }}
                                                    sx={{
                                                        display: 'flex',
                                                        mr: 10,
                                                        width: { xs: 100, sm: 100 },
                                                        mt: { sm: 0 },
                                                    }}
                                                    value={cardNo}
                                                    onChange={(e) => {
                                                        setCardNo(e.target.value);
                                                        handlePaymentAmount("cardNo", e.target.value);
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </FormGroup>
                    <CardContent container spacing={2}>
                        <Box sx={{ mr: 10, mb: 0, }} >
                            <Grid item xs={8}>
                                <Typography color="black" sx={{
                                    fontWeight: "bold",
                                    textAlign: { xs: "center", sm: "center" },
                                    px: 2,
                                }}>
                                    Grand Total: {totalEntered}
                                </Typography>
                            </Grid>
                        </Box>
                        <Grid item xs={12}>
                            <Box>
                                {error && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </CardContent>
                </CardContent>

                <Box className="modal-footer">
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={6}>
                            <Button className="btn btn-tertiary" onClick={handleConfirm}>
                                {okTitle}
                            </Button>
                        </Grid>
                        <Grid item md={6} xs={6}>
                            <Button className="btn btn-cancel" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>

        </Modal >
    );
};

export default PaymentDetailsModle;
