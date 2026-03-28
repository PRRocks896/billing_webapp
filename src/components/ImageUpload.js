// ImageUpload.js
import React, { useState } from 'react';
import { FiMinusCircle } from "react-icons/fi";
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { imagePath } from '../utils/helper';
import { useDropzone } from "react-dropzone";

const ImageUpload = ({
    title = 'Image Upload',
    value,
    onChange,
    error,
    multiple = false,
    accept = 'image/*'
}) => {
    const handleRemoveImage = (index) => {
        if (multiple) {
            const newImages = (value || []).filter((_, i) => i !== index);
            onChange(newImages);
        } else {
            onChange(null);
        }
    };

    const onDrop = (acceptedFiles) => {
        if (multiple) {
            onChange([...(value || []), ...acceptedFiles]);
        } else {
            onChange(acceptedFiles[0] || null);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: accept,
        multiple: multiple
    });

    const displayValues = multiple
        ? (Array.isArray(value) ? value : (value ? [value] : []))
        : (value ? [value] : []);

    const getSource = (file) => {
        if (!file) return '';
        if (Array.isArray(file) && file.length === 0) return '';
        if (Array.isArray(file) && file.length > 0) {
            if (typeof file[0] === 'string') {
                return imagePath(file[0]);
            }
            return URL.createObjectURL(file[0]);
        } else if (typeof file === 'string') {
            // return file.startsWith('http') || file.startsWith('blob:') || file.startsWith('data:') ? file : imagePath(file);
            return imagePath(file);
        } else {
            return URL.createObjectURL(file);
        }
    };

    const isVideo = accept && accept.includes('video');

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: 'auto' }}>
            <Typography variant="h6">{title}</Typography>
            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getInputProps()} accept={accept} />
                <p>Drag & drop some files here, or click to select files</p>
            </div>
            <br />
            <Box sx={{
                display: 'flex !important',
                flexDirection: 'row !important',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                {displayValues.length > 0 && displayValues.map((file, index) => (
                    <Box key={index} sx={{ position: 'relative', width: 'auto' }}>
                        {isVideo ? (
                            <video style={{ height: '100px', width: '250px', objectFit: 'cover', backgroundColor: '#000' }} crossOrigin="anonymous" src={getSource(file)} controls />
                        ) : (
                            <img style={{ height: '100px', width: '250px', objectFit: 'cover' }} crossOrigin="anonymous" src={getSource(file)} alt={`uploaded_img_${index}`} />
                        )}
                        <span
                            style={{
                                zIndex: 99,
                                top: '-10px',
                                right: '-10px',
                                cursor: 'pointer',
                                position: 'absolute',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                            }}
                        >
                            <FiMinusCircle size={26} style={{ backgroundColor: 'white', borderRadius: '50%' }} />
                        </span>
                    </Box>
                ))}
            </Box>
            {error && error.message && <FormHelperText error={true}>{error.message}</FormHelperText>}
        </Paper>
    );
};

export default ImageUpload;
