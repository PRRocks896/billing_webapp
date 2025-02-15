// ImageUpload.js
import React, { useState } from 'react';
import { FiMinusCircle } from "react-icons/fi";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { imagePath } from '../utils/helper';
import { useDropzone } from "react-dropzone";

const ImageUpload = ({
    title = 'Image Upload',
    value = [],
    onChange,
    error,
    multiple = false
}) => {
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        onChange(multiple ? [...value, ...files] : [files[0]]);
    };

    const handleRemoveImage = (index) => {
        const newImages = value.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const onDrop = (acceptedFiles) => {
        onChange(multiple ? [...value, ...acceptedFiles] : [acceptedFiles[0]]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: multiple
    });


    return (
        <Paper elevation={3} style={{ padding: '20px', margin: 'auto' }}>
            <Typography variant="h6">{title}</Typography>
            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                <p>Drag & drop some files here, or click to select files</p>
            </div>
            {/* <Input type="file" accept="image/*" multiple={multiple} onChange={handleFileChange} style={{ margin: '10px 0' }} /> */}
            <br/>
            <Box sx={{
                display: 'flex !important',
                flexDirection: 'row !important',
            }}>
                {value.length > 0 && value.map((file, index) => (
                    <Box key={index} sx={{ position: 'relative', marginBottom: '10px', width: 'auto' }}>
                        <img style={{ height: '100px', width: '250px' }} crossOrigin="anonymous" src={typeof file === 'object' ? URL.createObjectURL(file) : imagePath(file)} alt={`uploaded_img_${index}`} />
                        <span
                            style={{
                                zIndex: 99,
                                top: '-10px',
                                right: '-10px',
                                cursor: 'pointer',
                                position: 'absolute',
                            }}
                            onClick={() => handleRemoveImage(index)}
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

// // ImageUpload.js
// import React from 'react';

// import { FiMinusCircle } from "react-icons/fi";

// import Box from '@mui/material/Box';
// import Input from '@mui/material/Input';
// import FormHelperText from '@mui/material/FormHelperText';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import { imagePath } from '../utils/helper';

// const ImageUpload = ({
//     title = 'Image Upload',
//     value,
//     onChange,
//     error,
//     multiple = false
// }) => {
//     const handleFileChange = (event) => {
//         console.log(event.target.files);
//         onChange(event.target.files[0]);
//         // setSelectedFile(event.target.files[0]);
//     };

//     //   const handleUpload = () => {
//     //     // Implement your upload logic here
//     //     if (selectedFile) {
//     //         console.log('File uploaded:', selectedFile);
//     //         onChange(selectedFile);
//     //       // You can send the file to the server or perform any other actions
//     //     } else {
//     //         console.log('No file selected');
//     //         onChange(null);
//     //     }
//     //   };

//     return (
//         <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//             <Typography variant="h6">{title}</Typography>
//             {value ?
//                 <Box sx={{
//                     display: 'flex',
//                     position: 'relative'
//                 }}>
//                     <img style={{ width: '100%', height: '250px'}} crossOrigin="anonymous" src={typeof value === 'object' ? URL.createObjectURL(value) : typeof value === 'string' ? imagePath(value) : ''} alt="uploaded_img" />
//                     <span style={{
//                         zIndex: 99,
//                         top: '-10px',
//                         right: '-10px',
//                         cursor: 'pointer',
//                         position: 'absolute',
//                     }} onClick={() => onChange(null)}>
//                         <FiMinusCircle size={26} style={{ backgroundColor: 'white', borderRadius: '50%'}}/>
//                     </span>
//                 </Box>
//                 :
//                 <Input type="file" accept="image/*" onChange={handleFileChange} style={{ margin: '10px 0' }} />
//             }
//             {error && error.message &&
//                 <FormHelperText error={true}>{error.message}</FormHelperText>
//             }
//         </Paper>
//     );
// };

// export default ImageUpload;
