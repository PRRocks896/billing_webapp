import {
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
import { FiSearch } from "react-icons/fi";

const SelectManager = ({
    isOpen,
    setOpen,
    managerOption,
    fetchManager,
    handleClose,
    handleSelectManager,
}) => {
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
                                    <Box className="search-box">
                                        <InputBase
                                            name={`manager`}
                                            placeholder={`Search Manager`}
                                            // value={searchValue}
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
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {managerOption?.map((item, index) => (
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
                                ))}
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
                </Box>
            </Fade>
        </Modal>
    )
}

export default SelectManager;