/* eslint-disable no-undef */
import React, { useMemo, useEffect, useReducer } from "react";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";

import { getPaymentTypeList } from "../service/paymentType";
import {
    listPayload,
    capitalizeFirstLetter
} from "../utils/helper";

const paymentDetailReducer = (state, action) => {
    switch (action.type) {
        case "SET_DETAILS":
            const detail = action.payload.map((item) => {
                const base = {
                    name: capitalizeFirstLetter(`${item.name} Sale`),
                    amount: 0,
                    enabled: false,
                    id: item.id
                }
                if (['CARD', 'card', 'Card'].includes(item.name)) {
                    base.cardNo = "";
                }
                return base;
            })
            return {
                ...state,
                detail: detail
            }
        case "SET_CHECKBOX":
            const find = state.detail?.findIndex((item) => item.id === action.payload.id);
            if (find >= 0) {
                const updateDetail = state.detail;
                updateDetail[find].enabled = action.payload.value;

                return {
                    ...state,
                    detail: updateDetail
                }
            }
        case "SET_AMOUNT":
            const index = state.detail?.findIndex((item) => item.id === action.payload.id);
            if (index >= 0) {
                const updateDetail = state.detail;
                updateDetail[index].amount = action.payload.value;

                return {
                    ...state,
                    detail: updateDetail
                }
            }
        case "SET_CARD_NO":
            const cardIndex = state.detail?.findIndex((item) => item.id === action.payload.id);
            if (cardIndex >= 0) {
                const updateDetail = state.detail;
                updateDetail[cardIndex].cardNo = action.payload.value;

                return {
                    ...state,
                    detail: updateDetail
                }
            }
        default:
            return state;
    }
}

const PaymentDetailsModle = ({
    open,
    detail,
    okTitle = " Confirm",
    handleOk,
    handleClose,
    grandTotal = null,
}) => {

    const [paymentType, setPaymentType] = useState([]);
    const [paymentDetail, dispath] = useReducer(paymentDetailReducer, {
        detail: null,
        total: 0
    })

    const [error, setError] = useState("");

    const totalEntered = useMemo(() => {
        if (paymentDetail && paymentDetail.detail && paymentDetail.detail.length > 0) {
            return paymentDetail.detail?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        }
        return 0;

    }, [paymentDetail]);

    const handleConfirm = () => {
        const cardError = paymentDetail.detail?.find(
            (item) =>
                item.enabled && typeof item.cardNo === 'string' && item.cardNo.length !== 4
                // (!item.cardNo || item.cardNo.length !== 4)
        );

        if(cardError) {
            setError("Please enter a last 4-digit card no.");
            return;
        }

        if (grandTotal && totalEntered !== parseFloat(grandTotal)) {
            setError(
                `Total amount enter (${totalEntered}) must match Grand Total (${grandTotal})`
            );
            return;
        }

        setError("");
        handleOk(paymentDetail.detail.filter((item) => parseFloat(item.amount) > 0));
    };

    useEffect(() => {
        const fetchPaymentTypes = async () => {
            try {
                const whereCondition = {
                    isActive: true,
                    isDeleted: false
                };
                const payload = listPayload(0, whereCondition, 100000);
                const response = await getPaymentTypeList(payload);
                if (response?.data) {
                    setPaymentType(response.data.rows);
                    dispath({
                        type: "SET_DETAILS",
                        payload: response.data.rows,
                    })
                }
            } catch (error) {
                console.error("Error fetching payment types:", error);
            }
        };
        if (open) {
            fetchPaymentTypes();
        }
    }, [open]);

    return (
        <Modal
            disableEscapeKeyDown
            aria-labelledby="payment-breakdown-title"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 2,
                // width: {
                //     xs: "80%",
                //     sm: "80%",
                //     md: "60%",
                //     lg: "50%",
                // },
                // maxHeight: "auto",
                // overflowY: "hidden",
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
                >
                    Payment Option
                </Typography>
                <Box className="modal-body">
                    <FormGroup>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                {paymentDetail?.detail?.map((item, index) => (
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 1,
                                    }}>
                                        <Checkbox
                                            checked={item.enabled}
                                            onChange={(e) => {
                                                dispath({
                                                    type: 'SET_CHECKBOX',
                                                    payload: {
                                                        id: item.id,
                                                        value: e.target.checked
                                                    }
                                                })
                                            }}
                                        />
                                        <Typography sx={{ minWidth: 90, flexShrink: 0 }}>{item.name}</Typography>
                                        <TextField
                                            size="small"
                                            type="number"
                                            label="Amount"
                                            sx={{ width: { xs: "100%", sm: 200 } }}
                                            disabled={!item.enabled}
                                            value={item.amount}
                                            onChange={(e) => {
                                                dispath({
                                                    type: "SET_AMOUNT",
                                                    payload: {
                                                        id: item.id,
                                                        value: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                        {/* <Box sx={{ width: '28%'}}> */}
                                        {['card sale', 'CARD SALE', 'Card Sale'].includes(item.name) &&
                                            <TextField
                                                size="small"
                                                type="text"
                                                label="Card No"
                                                inputProps={{ maxLength: 4 }}
                                                sx={{
                                                    width: { xs: '100%', sm: 100 },
                                                    flexGrow: { xs: 1, sm: 0 },
                                                }}
                                                disabled={!item.enabled}
                                                value={item.cardNo}
                                                onChange={(e) => {
                                                    dispath({
                                                        type: "SET_CARD_NO",
                                                        payload: {
                                                            id: item.id,
                                                            value: e.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        }
                                        {/* </Box> */}
                                    </Box>
                                ))}
                                {/* <Box sx={{
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
                                    
                                </Box> */}
                            </Grid>
                            {/* <Grid item xs={12} sm={12}>
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

                                        {/* </Grid> 
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
                            </Grid> */}
                        </Grid>
                    </FormGroup>
                    <Box sx={{ mr: 10, mb: 0, }} >
                        <Typography color="black" sx={{
                            fontWeight: "bold",
                            textAlign: { xs: "center", sm: "center" },
                            px: 2,
                        }}>
                            Grand Total: {totalEntered}
                        </Typography>
                    </Box>
                    <Box>
                        {error && (
                            <Typography color="error" sx={{ mb: 0, textAlign: "center", mt: 1}}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box className="modal-footer" sx={{
                    position: 'relative !important',
                    bottom: '0px !important',
                    right: '0px !important'
                }}>
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
