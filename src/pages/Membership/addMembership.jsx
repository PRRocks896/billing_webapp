import React from "react";
import { Controller } from "react-hook-form";

import { FiPlusCircle, FiMinusCircle} from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormHelpText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useAddMembership } from "./hook/useAddMembership.hook";
import AddCustomer from "../Bill/AddCustomer";
import ImageUpload from "../../components/ImageUpload";

const AddMemberShip = () => {
    const {
        user,
        control,
        customer,
        paymentType,
        isSubmitting,
        membershipPlan,
        isCardSelected,
        isCustomerModalOpen,
        onSubmit,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        setIsCustomerModalOpen,
        setCustomerSelectedHandler
    } = useAddMembership();
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="userID"
                                            render={({
                                                field: { onBlur, onChange, value},
                                                fieldState: { error }
                                            }) => (
                                                <Autocomplete
                                                    freeSolo
                                                    size="small"
                                                    id="userID"
                                                    isOptionEqualToValue={(option, value) => option?.id === value}
                                                    getOptionLabel={(option) => option.branchName ? option.branchName : ''}
                                                    options={user || []}
                                                    value={user?.find((option) => option.id === value) ?? ''}
                                                    onChange={(_event, value) => {
                                                        if(value) {
                                                            onChange(value?.id)
                                                        } else {
                                                            onChange(null);
                                                        }
                                                    }}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {option.branchName}
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Branch"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                            rules={{
                                                required: 'Please Select Branch'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            control={control}
                                            name='billNo'
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        variant="outlined"
                                                        label="Bill No"
                                                        size="small"
                                                        name="billNo"
                                                        value={value || ''}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Enter Bill No'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            control={control}
                                            name="createdAt"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        type="date"
                                                        variant="outlined"
                                                        label="Date"
                                                        size="small"
                                                        name="date"
                                                        value={value || new Date()}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Date' 
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="customerID"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <Box sx={{ display: "grid", gridTemplateColumns: "4fr 0.5fr" }}>
                                                    <Autocomplete
                                                        freeSolo
                                                        size="small"
                                                        id="customerID"
                                                        options={customer || []}
                                                        getOptionLabel={(option) => option.name ? `${option.name}-(${option.phoneNumber})` : ''}
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        value={customer?.find((option) => option.id === value) ?? ''}
                                                        // onBlur={onBlur}
                                                        onChange={(_event, value) => {
                                                            if(value) {
                                                                onChange(value?.id)
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        onInputChange={(_event, value) => searchCustomer(value)}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.value}>
                                                              {option.name}-{`(${option?.phoneNumber})`}
                                                            </li>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                              {...params}
                                                              label="Customer Ph No."
                                                              error={!!error}
                                                              helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                    <Button
                                                        sx={{ padding: "0px" }}
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => setIsCustomerModalOpen(true)}
                                                    >
                                                        <FiPlusCircle />
                                                    </Button>
                                                </Box>
                                            )}
                                            rules={{
                                                required: "Please Select Customer",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="membershipPlanID"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="membership">Membership Plan</InputLabel>
                                                    <Select
                                                        labelId="membership"
                                                        id="membership-select"
                                                        value={value || ""}
                                                        label="Membership Plan"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        {membershipPlan?.map((res, ind) => (
                                                            <MenuItem style={{ textTransform: "capitalize" }} key={`membership_${ind}`} value={res.id}>
                                                                {res.planName} ({res.price}/-) ({res.hours} Hours)
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {error && error.message &&
                                                        <FormHelpText error={true}>{error.message}</FormHelpText>
                                                    }
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Memership Plan'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="managerName"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        label="Manager Name"
                                                        variant="outlined"
                                                        size="small"
                                                        name="managerName"
                                                        value={value || ''}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Enter Manager Name'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="validity"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="validity">Validity</InputLabel>
                                                    <Select
                                                        labelId="validity"
                                                        id="validity-select"
                                                        value={value || 6}
                                                        label="Validity"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        <MenuItem style={{ textTransform: "capitalize" }} value={'6'}>
                                                            6 Months
                                                        </MenuItem>
                                                        <MenuItem style={{ textTransform: "capitalize" }} value={'12'}>
                                                            1 Year
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Memership Plan'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="paymentID"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="paidBy">Paid By</InputLabel>
                                                    <Select
                                                        labelId="paidBy"
                                                        id="paidBy-select"
                                                        value={value}
                                                        label="Paid By"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        {paymentType?.map((res, ind) => (
                                                            <MenuItem style={{ textTransform: "capitalize" }} key={`paidBy_${ind}`} value={res.id}>
                                                                {res.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {error && error.message &&
                                                        <FormHelpText error={true}>{error.message}</FormHelpText>
                                                    }
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Paid By'
                                            }}
                                        />
                                    </Grid>
                                    {isCardSelected &&
                                        <Grid item xs={12} sm={12}>
                                            <Controller
                                                control={control}
                                                name="cardNo"
                                                render={({
                                                    field: { onBlur, onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <TextField
                                                            label="Last 4 Digit Card No"
                                                            variant="outlined"
                                                            size="small"
                                                            name="cardNo"
                                                            value={value || ''}
                                                            onChange={(e) => {
                                                                if(e.target.value.length < 5) {
                                                                    onChange(e.target.value)
                                                                }
                                                            }}
                                                            onBlur={onBlur}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Last 4 Digit Of Card Number'
                                                }}
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={8}>
                                        <Controller
                                            control={control}
                                            name="extraHours"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 4fr',  alignItems: 'center'}}>
                                                    <span
                                                        style={{ marginRight: '14px', fontSize: '24px', cursor: 'pointer'}}
                                                        onClick={() =>  {
                                                            onChange(parseInt(value) + 1)
                                                        }}
                                                    >
                                                        <FiPlusCircle/>
                                                    </span>
                                                    <FormControl
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <TextField
                                                            label="Extra Hours"
                                                            variant="outlined"
                                                            size="small"
                                                            name="extrahours"
                                                            value={value || ''}
                                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                            onBlur={onBlur}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                    <span
                                                        style={{ marginLeft: '14px', fontSize: '24px', cursor: 'pointer'}}
                                                        onClick={() => {
                                                            if(parseInt(value) > 0) {
                                                                onChange(parseInt(value) - 1)
                                                            }
                                                        }}
                                                    >
                                                        <FiMinusCircle/>
                                                    </span>
                                                </Box>
                                            )}
                                            rules={{
                                                required: 'Please Enter Remaining Minutes',
                                                pattern: {
                                                    value: /^\d*(\.\d{0,2})?$/i,
                                                    message: "please enter digit only.",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name='minutes'
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        variant="outlined"
                                                        label="Minutes"
                                                        size="small"
                                                        name="minutes"
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Enter Minutes'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    control={control}
                                    name="registerPhoto"
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <ImageUpload
                                            key={'img-upload'}
                                            value={value}
                                            onChange={onChange}
                                            error={error}
                                        />
                                    )}
                                    rules={{
                                        required: 'Please Upload File'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                        <Button disabled={isSubmitting} className="btn btn-tertiary" variant="contained" type="submit">
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </form>
            <AddCustomer
                isCustomerModalOpen={isCustomerModalOpen}
                setIsCustomerModalOpen={setIsCustomerModalOpen}
                setCustomerSelectedHandler={setCustomerSelectedHandler}
            />
        </>
    )
}

export default AddMemberShip;