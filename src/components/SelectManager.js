import {
    Autocomplete,
    Box,
    Button,
    Fade,
    FormControl,
    FormGroup,
    Grid,
    Modal,
    TextField,
    InputBase,
    InputAdornment,
    IconButton,
    Select,
    MenuItem,
    Typography,
    Link,
} from "@mui/material";
import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";

const SelectManager = ({
    isOpen,
    setOpen,
    managerOption,
    fetchManager,
    handleClose,
    handleSelectManager,
}) => {
    const selectedManager = useMemo(() => {
        return localStorage.getItem('managerName');
        // const managerId = localStorage.getItem('managerId');
        // if(managerId) {
        //     const managerIds = managerId.split(',').map((item) => parseInt(item.trim()));
        //     return managerOption.filter((item) => managerIds.includes(item.id));
        // }
        // return [];
    }, [localStorage.getItem('managerName')]);
    return (
        <Modal
            disableEscapeKeyDown
            open={isOpen}
            onClose={(e, reason) => {
                if (reason === 'backdropClick') {
                    return;
                }
                setOpen(false)
                handleClose()
            }}
            disableEnforceFocus={true}
            closeAfterTransition
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={isOpen}>
                <Box className="modal-wrapper modal-bg">
                    <Typography variant="h6" component="h6" className="text-black modal-title">
                        Select Manager
                    </Typography>
                    <Box className="modal-body">
                        <FormGroup className="form-field">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" className="text-black modal-title">
                                        Selected Manager:- {selectedManager}
                                    </Typography>
                                    {/* <Box className="search-box">
                                        <InputBase
                                            name={`manager`}
                                            placeholder={`Search Manager`}
                                            onChange={(e) => {
                                                fetchManager(e.target.value.toLowerCase());
                                            }}
                                            endAdornment={
                                                <InputAdornment
                                                    position="end"
                                                    className="end-input-icon text-grey"
                                                >
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        edge="end"
                                                    >
                                                        <FiSearch />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </Box> */}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        fullWidth
                                        freeSolo
                                        size="small"
                                        disablePortal
                                        multiple
                                        id="Branch"
                                        options={managerOption || []}
                                        getOptionLabel={(option) => `${option.nickName} (${option.name})`}
                                        // value={selectedManager}
                                        onInputChange={(event, newInputValue) => {fetchManager(newInputValue.toLowerCase());}}
                                        onChange={(event, newValue) => {
                                            // console.log(newValue);
                                            if(newValue.length > 0) {
                                                handleSelectManager(newValue);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Manager" />
                                        )}
                                    />
                                </Grid>
                                {/* {managerOption?.map((item, index) => (
                                    <Grid item xs={12} key={index}>
                                        <FormControl size="small" variant="standard" className="form-control">
                                            <Link
                                                component="button"
                                                variant="body2"
                                                style={{ textDecoration: 'none', color: '#000' }}
                                                onClick={() => handleSelectManager(item)}
                                            >
                                                <Typography variant="h6" component="h6" className="text-black modal-title">
                                                    {item.nickName} ({item.name})
                                                </Typography>
                                            </Link>
                                        </FormControl>
                                    </Grid>
                                ))} */}
                                {managerOption?.length === 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" className="text-grey">
                                            No manager found
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </FormGroup>
                    </Box>
                    <Box className="modal-footer">
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <Button
                                    className="btn btn-tertiary"
                                    onClick={() => {
                                        setOpen(false);
                                        handleClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Button
                                    className="btn btn-tertiary"
                                    onClick={() => {
                                        setOpen(false);
                                        handleClose();
                                    }}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default SelectManager;