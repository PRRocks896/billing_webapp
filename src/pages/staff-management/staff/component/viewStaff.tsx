import Box from "@mui/material/Box";
import UseViewStaff from "../hooks/useViewStaff";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { imagePath } from "utils/helper";
import { DocumentDownload, ArrowLeft, Gallery, DocumentText, Warning2, Paperclip } from "iconsax-reactjs";
import MainCard from "components/MainCard";
import { alpha, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

const ViewStaff = () => {
    const theme = useTheme();
    const {
        addressProof,
        certificatePhoto,
        idProof,
        passbookPhoto,
        signaturePhoto,
        staffPhoto,
        staffData,
        download,
        handleBack,
    } = UseViewStaff();

    const getFileType = (path: string): 'image' | 'pdf' | 'other' => {
        const ext = path?.split('.').pop()?.toLowerCase() ?? '';
        if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    };

    const showDetail = (title: string, path: string) => {
        const hasFile = path !== null;
        const fileType = hasFile ? getFileType(path) : 'other';

        const cardIcon = fileType === 'image'
            ? <Gallery size={18} variant="Bold" />
            : fileType === 'pdf'
                ? <DocumentText size={18} variant="Bold" />
                : <Paperclip size={18} variant="Bold" />;

        const renderContent = () => {
            if (!hasFile) {
                return (
                    <Stack spacing={2} alignItems="center" justifyContent="center">
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Warning2 size={32} color={theme.palette.error.main} variant="Bulk" />
                        </Box>
                        <Typography variant="subtitle2" color="error.main" fontWeight={600}>
                            Document Not Uploaded
                        </Typography>
                    </Stack>
                );
            }

            if (fileType === 'image') {
                return (
                    <Box sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                        <img
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                            crossOrigin="anonymous"
                            src={imagePath(path)}
                            alt={title}
                        />
                    </Box>
                );
            }

            if (fileType === 'pdf') {
                return (
                    <Box sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                        <iframe
                            src={imagePath(path)}
                            title={title}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </Box>
                );
            }

            // Unknown file type — show a styled open link
            return (
                <Stack spacing={2} alignItems="center" justifyContent="center">
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Paperclip size={32} color={theme.palette.primary.main} variant="Bulk" />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        Preview not available
                    </Typography>
                    <Box
                        component="a"
                        href={imagePath(path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                    >
                        Open File
                    </Box>
                </Stack>
            );
        };

        return (
            <MainCard
                content={false}
                sx={{
                    height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                        transform: 'translateY(-4px)'
                    }
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {cardIcon}
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {title}
                        </Typography>
                    </Stack>

                    {hasFile && (
                        <IconButton
                            color="primary"
                            onClick={() => download(title, imagePath(path))}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                            }}
                            size="small"
                        >
                            <DocumentDownload size={18} variant="Bold" />
                        </IconButton>
                    )}
                </Box>

                {/* Content */}
                <Box sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.background.default }}>
                    {renderContent()}
                </Box>
            </MainCard>
        );
    };

    return (
        <MainCard 
            content={false} 
            sx={{ 
                overflow: 'visible', 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px'
            }}
        >
            {/* Hero Header */}
            <Box
                sx={{
                    px: 3,
                    py: 3.5,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                    >
                        <DocumentText size={24} color="#fff" variant="Bold" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Staff Documents & Identification
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            View and download {staffData?.name ? `${staffData.name}'s` : 'staff'} uploaded identity and banking documents
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleBack}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{ borderRadius: 2 }}
                >
                    Back to List
                </Button>
            </Box>

            <Box sx={{ p: 4, bgcolor: theme.palette.background.default, borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('ID Proof', idProof)}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('Staff Photo', staffPhoto)}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('Address Proof', addressProof)}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('Passbook Photo', passbookPhoto)}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('Signature Photo', signaturePhoto)}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {showDetail('Certificate Photo', certificatePhoto)}
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
}

export default ViewStaff;