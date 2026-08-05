import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// icons
import { DocumentUpload, Trash, Eye } from 'iconsax-reactjs';
import { imagePath } from 'utils/helper';

import { openSnackbar } from 'api/snackbar';

// types
export type FileUploadValue = File | string;

interface FileUploadProps {
    value?: FileUploadValue | FileUploadValue[];
    onChange: (files: FileUploadValue | FileUploadValue[] | null) => void;
    multiple?: boolean;
    accept?: string;
    maxSize?: number; // in bytes
    label?: string;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    uploadCount?: number;
}

interface FilePreview {
    id: string;
    name: string;
    type: string;
    url: string;
    isString: boolean;
    file?: File;
}

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

// Helper function to determine file type category
const getFileCategory = (type: string, extension: string): 'image' | 'video' | 'pdf' | 'document' | 'other' => {
    if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension)) return 'image';
    if (type.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension)) return 'video';
    if (type === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (
        type.includes('document') ||
        type.includes('word') ||
        type.includes('excel') ||
        type.includes('spreadsheet') ||
        ['doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'].includes(extension)
    ) {
        return 'document';
    }
    return 'other';
};

// Helper function to convert File or string to FilePreview
const createFilePreview = (fileOrString: FileUploadValue, index: number): FilePreview => {
    if (typeof fileOrString === 'string') {
        const extension = getFileExtension(fileOrString);
        const name = fileOrString.split('/').pop() || 'file';
        return {
            id: `string-${index}-${Date.now()}`,
            name,
            type: `file/${extension}`,
            url: imagePath(fileOrString),
            isString: true,
        };
    } else {
        return {
            id: `file-${index}-${Date.now()}`,
            name: fileOrString.name,
            type: fileOrString.type,
            url: URL.createObjectURL(fileOrString),
            isString: false,
            file: fileOrString,
        };
    }
};

const FileUpload = ({
    value,
    onChange,
    multiple = false,
    accept,
    maxSize = 5242880, // 5MB default
    label = 'Upload File',
    error = false,
    helperText,
    disabled = false,
    uploadCount,
}: FileUploadProps) => {
    const theme = useTheme();
    const [previews, setPreviews] = useState<FilePreview[]>([]);
    const [previewOpen, setPreviewOpen] = useState<string | null>(null);

    // Initialize previews from value prop
    useEffect(() => {
        if (!value) {
            setPreviews([]);
            return;
        }

        const files = Array.isArray(value) ? value : [value];
        const newPreviews = files.map((file, index) => createFilePreview(file, index));
        setPreviews(newPreviews);

        // Cleanup object URLs on unmount
        return () => {
            newPreviews.forEach((preview) => {
                if (!preview.isString && preview.url) {
                    URL.revokeObjectURL(preview.url);
                }
            });
        };
    }, [value]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (disabled) return;

            if (multiple) {
                const currentFiles = value ? (Array.isArray(value) ? value : [value]) : [];
                
                if (uploadCount && (currentFiles.length + acceptedFiles.length) > uploadCount) {
                    openSnackbar({
                        open: true,
                        message: `You can only upload up to ${uploadCount} file${uploadCount > 1 ? 's' : ''}.`,
                        variant: 'alert',
                        alert: { color: 'error' },
                        close: true
                    });
                    return;
                }

                const newFiles = [...currentFiles, ...acceptedFiles];
                onChange(newFiles);
            } else {
                onChange(acceptedFiles[0] || null);
            }
        },
        [multiple, value, onChange, disabled, uploadCount]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept ? { [accept]: [] } : undefined,
        maxSize,
        multiple,
        disabled,
    });

    const handleRemove = (id: string) => {
        const preview = previews.find((p) => p.id === id);
        if (!preview) return;

        // Revoke object URL if it's a File object
        if (!preview.isString && preview.url) {
            URL.revokeObjectURL(preview.url);
        }

        const updatedPreviews = previews.filter((p) => p.id !== id);

        if (multiple) {
            const files = updatedPreviews.map((p) => (p.isString ? p.url : p.file!));
            onChange(files.length > 0 ? files : null);
        } else {
            onChange(null);
        }
    };

    const renderPreview = (preview: FilePreview) => {
        const extension = getFileExtension(preview.name);
        const category = getFileCategory(preview.type, extension);

        return (
            <Box
                key={preview.id}
                sx={{
                    position: 'relative',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                {/* Preview Icon/Image */}
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.grey[100],
                        flexShrink: 0,
                    }}
                >
                    {category === 'image' ? (
                        <img
                            src={preview.url}
                            alt={preview.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : category === 'video' ? (
                        <video
                            src={preview.url}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <DocumentUpload size={32} variant="Bulk" />
                    )}
                </Box>

                {/* File Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap title={preview.name}>
                        {preview.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {preview.isString ? 'Uploaded' : preview.file ? `${(preview.file.size / 1024).toFixed(2)} KB` : ''}
                    </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.5}>
                    {(category === 'image' || category === 'video' || category === 'pdf') && (
                        <IconButton
                            size="small"
                            onClick={() => window.open(preview.url, '_blank')}
                            disabled={disabled}
                        >
                            <Eye size={18} />
                        </IconButton>
                    )}
                    <IconButton size="small" onClick={() => handleRemove(preview.id)} disabled={disabled} color="error">
                        <Trash size={18} />
                    </IconButton>
                </Stack>
            </Box>
        );
    };

    return (
        <Box>
            {label && (
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {label}
                </Typography>
            )}

            {/* Dropzone */}
            <Box
                {...getRootProps()}
                sx={{
                    border: `2px dashed ${error ? theme.palette.error.main : isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isDragActive
                        ? theme.palette.action.hover
                        : disabled
                            ? theme.palette.action.disabledBackground
                            : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: disabled ? theme.palette.divider : theme.palette.primary.main,
                        backgroundColor: disabled ? theme.palette.action.disabledBackground : theme.palette.action.hover,
                    },
                }}
            >
                <input {...getInputProps()} />
                <DocumentUpload size={48} variant="Bulk" style={{ marginBottom: 8 }} />
                <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    or
                </Typography>
                <Button variant="outlined" disabled={disabled} sx={{ mt: 1 }}>
                    Browse Files
                </Button>
                <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 2 }}>
                    {accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
                    {' • '}
                    Max size: {(maxSize / 1048576).toFixed(2)} MB
                </Typography>
            </Box>

            {/* Helper Text */}
            {helperText && (
                <Typography
                    variant="caption"
                    color={error ? 'error' : 'textSecondary'}
                    sx={{ mt: 0.5, display: 'block' }}
                >
                    {helperText}
                </Typography>
            )}

            {/* File Previews */}
            {previews.length > 0 && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                    {previews.map((preview) => renderPreview(preview))}
                </Stack>
            )}
        </Box>
    );
};

export default FileUpload;
