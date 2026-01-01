import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Box, 
    LinearProgress,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FaceLivenessAuth from './FaceLivenessAuth'; // Your logic component

const FaceAuthModal = ({ open, handleClose, mode, staffId, onAuthSuccess }) => {
    
    // We can pass a callback to the Liveness component 
    // to close the modal automatically on success
    const handleComplete = (data) => {
        setTimeout(() => {
            onAuthSuccess(data);
            handleClose();
        }, 1500); // Small delay so user sees "Success"
    };

    return (
        <Dialog 
            open={open} 
            onClose={(event, reason) => {
                // Prevent closing by clicking outside during active scan
                if (reason !== 'backdropClick') handleClose();
            }}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                    {mode === 'register' ? 'Face Registration' : 'Face Verification'}
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', bgcolor: '#f0f2f5' }}>
                    {/* Your FaceLivenessAuth component goes here */}
                    <FaceLivenessAuth 
                        mode={mode} 
                        staffId={staffId} 
                        onComplete={handleComplete} 
                    />
                </Box>
            </DialogContent>

            {/* <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Please ensure you are in a well-lit area.
                </Typography>
            </DialogActions> */}
        </Dialog>
    );
};

export default FaceAuthModal;