import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

type CustomDailogBoxProps = {
    open: boolean;
    title: string;
    icon?: any;
    description?: string;
    btnText1?: string;
    btnText2?: string;
    isError?: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
};

const CustomDailogBox = ({
    open,
    title,
    icon,
    description,
    btnText1 = "Cancel",
    btnText2 = "Delete",
    isError = true,
    handleClose,
    handleSubmit,
}: CustomDailogBoxProps) => {
    return (
        <Dialog open={open} onClose={() => handleClose()}>
            <DialogTitle>
                {icon}
                {title}
            </DialogTitle>
            <DialogContent>
                {description}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>{btnText1}</Button>
                <Button variant="contained" color={isError ? "error" : "primary"} onClick={() => handleSubmit()}>{btnText2}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDailogBox;
