import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Interval to check for SW updates (every 60 seconds)
const SW_CHECK_INTERVAL = 60 * 1000;

const ReloadPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, registration) {
            console.log('[PWA] Service Worker registered:', swUrl);
            if (registration) {
                setInterval(() => {
                    registration.update();
                }, SW_CHECK_INTERVAL);
            }
        },
        onRegisterError(error) {
            console.error('[PWA] Service Worker registration error:', error);
        },
    });

    useEffect(() => {
        if (needRefresh) {
            setShowPrompt(true);
        }
    }, [needRefresh]);

    const handleReload = () => {
        updateServiceWorker(true);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setNeedRefresh(false);
    };

    return (
        <Snackbar
            open={showPrompt}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                severity="info"
                variant="filled"
                action={
                    <Stack direction="row" spacing={1}>
                        <Button size="small" color="inherit" variant="outlined" onClick={handleReload}>
                            Reload
                        </Button>
                        <Button size="small" color="inherit" onClick={handleDismiss}>
                            Dismiss
                        </Button>
                    </Stack>
                }
                sx={{ width: '100%' }}
            >
                New version available! Click reload to update.
            </Alert>
        </Snackbar>
    );
};

export default ReloadPrompt;
