import { useEffect, useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// third-party
import { CloseCircle } from 'iconsax-reactjs';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DAYS = 1;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const wasRecentlyDismissed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return !!at && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

// The browser fires `beforeinstallprompt` once, often before React mounts, so capture it at module load.
let capturedPrompt: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<(e: BeforeInstallPromptEvent | null) => void>();
const publish = (e: BeforeInstallPromptEvent | null) => {
  capturedPrompt = e;
  subscribers.forEach((fn) => fn(e));
};
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('[PWA] beforeinstallprompt captured');
    publish(e as BeforeInstallPromptEvent);
  });
  window.addEventListener('appinstalled', () => publish(null));
}

// ==============================|| PWA - INSTALL PROMPT ||============================== //

export default function InstallPrompt() {
  const theme = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(capturedPrompt);
  const [open, setOpen] = useState(!!capturedPrompt && !wasRecentlyDismissed());

  useEffect(() => {
    if (isStandalone()) return;

    const onChange = (e: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(e);
      setOpen(!!e && !wasRecentlyDismissed());
    };
    subscribers.add(onChange);
    return () => {
      subscribers.delete(onChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setOpen(false);
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // the event can only be used once
    publish(null);
  };

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // storage unavailable: popup simply returns next visit
    }
  };

  if (!deferredPrompt) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          mx: 'auto',
          zIndex: theme.zIndex.snackbar,
          maxWidth: 480,
          p: 1.5,
          pl: 2,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} sx={{ alignItems: 'center' }}>
          <Avatar variant="rounded" src="/pwa-192x192.png" alt="Bill System" sx={{ width: 44, height: 44, flexShrink: 0 }} />
          <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>Install Bill System</Typography>
            <Typography variant="caption" color="text.secondary">
              For faster, full-screen access.
            </Typography>
          </Stack>
          <Button variant="contained" size="small" sx={{ flexShrink: 0 }} onClick={handleInstall}>
            Install
          </Button>
          <IconButton size="small" aria-label="Close" onClick={handleClose}>
            <CloseCircle size={20} />
          </IconButton>
        </Stack>
      </Paper>
    </Slide>
  );
}
