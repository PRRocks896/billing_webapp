// ImageUpload.js
import React from 'react';

import { FiMinusCircle } from "react-icons/fi";

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ImageUpload = ({ title = 'Image Upload', value, onChange, error }) => {
    const handleFileChange = (event) => {
        onChange(event.target.files[0]);
        // setSelectedFile(event.target.files[0]);
    };

    //   const handleUpload = () => {
    //     // Implement your upload logic here
    //     if (selectedFile) {
    //         console.log('File uploaded:', selectedFile);
    //         onChange(selectedFile);
    //       // You can send the file to the server or perform any other actions
    //     } else {
    //         console.log('No file selected');
    //         onChange(null);
    //     }
    //   };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <Typography variant="h6">{title}</Typography>
            {value ?
                <Box sx={{
                    display: 'flex',
                    position: 'relative'
                }}>
                    <img crossOrigin="anonymous" src={typeof value === 'object' ? URL.createObjectURL(value) : ''} alt="uploaded_img" />
                    <span style={{
                        zIndex: 99,
                        top: '-10px',
                        right: '-10px',
                        cursor: 'pointer',
                        position: 'absolute',
                    }} onClick={() => onChange(null)}>
                        <FiMinusCircle size={26} style={{ backgroundColor: 'white', borderRadius: '50%'}}/>
                    </span>
                </Box>
                :
                <Input type="file" onChange={handleFileChange} style={{ margin: '10px 0' }} />
            }
            {error && error.message &&
                <FormHelperText error={true}>{error.message}</FormHelperText>
            }
        </Paper>
    );
};

export default ImageUpload;
