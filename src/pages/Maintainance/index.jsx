import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { keyframes } from '@mui/system';

// Define a simple animation for the icon
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const UnderMaintainance = () => {
    const theme = useTheme();

    // You can customize the image/icon and text details here
    const pageTitle = "Site Under Maintenance";
    const mainMessage = "We're currently performing scheduled maintenance to improve your experience. We apologize for any inconvenience.";
    const estimatedTime = "We expect to be back online shortly, usually within the hour.";
    const contactLink = "mailto:support@example.com";
    const homeLink = "/"; // Link to the home page (if accessible)
    return (
        <>
            <Container component="main" maxWidth="md" sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4, // Padding top and bottom
                backgroundColor: theme.palette.grey[100] // Light background for contrast
            }}>
                <Paper elevation={6} sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 2, // Rounded corners
                    width: '100%',
                    maxWidth: 600,
                }}>
                    <Box sx={{ mb: 3 }}>
                        {/* Animated Construction Icon */}
                        <ConstructionIcon
                            color="primary"
                            sx={{
                                fontSize: 80,
                                mb: 2,
                                animation: `${spin} 2s linear infinite`, // Apply the spinning animation
                            }}
                        />
                    </Box>

                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {pageTitle}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" paragraph>
                        {mainMessage}
                    </Typography>

                    <Typography variant="body1" color="text.primary" sx={{ mb: 4, fontStyle: 'italic' }}>
                        **Status:** {estimatedTime}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            href={contactLink}
                        // Add other props like target="_blank" for external link
                        >
                            Contact Support
                        </Button> */}

                        {/* <Button
                            variant="outlined"
                            color="secondary"
                            href={homeLink}
                        >
                            Try Again Later
                        </Button> */}
                    </Box>
                </Paper>
            </Container>
        </>
    )
}

export default UnderMaintainance;