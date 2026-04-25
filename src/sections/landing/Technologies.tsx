import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project-imports
import FadeInWhenVisible from './Animation';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import { techData } from 'data/tech-data';
import { useBuyNowLink } from 'hooks/buyNowLink';

// assets
import { ExportSquare } from 'iconsax-reactjs';
import GithubIcon from 'assets/third-party/github';

// ==============================|| LANDING - TECHNOLOGIES PAGE ||============================== //

export default function TechnologiesPage() {
  const { getQueryParams } = useBuyNowLink();

  return (
    <Container>
      <Stack sx={{ gap: 3, alignItems: 'center', justifyContent: 'center', mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Stack spacing={2} sx={{ textAlign: 'center', mb: 3, pt: 3 }}>
          <motion.div
            initial={{ opacity: 0, translateY: 550 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 30,
              delay: 0.2
            }}
          >
            <Typography variant="h2">Available Technologies</Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: 550 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 30,
              delay: 0.4
            }}
          >
            <Typography>Explore the Demos of Able Pro in multiple technologies.</Typography>
          </motion.div>
        </Stack>
        <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          {techData.map((tech, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
              <FadeInWhenVisible>
                <MainCard>
                  <Stack spacing={2}>
                    <Box>
                      <CardMedia component="img" image={tech.image} sx={{ width: 'auto' }} alt="tech-image" />
                    </Box>
                    <Typography variant="h4">{tech.label}</Typography>
                    <Typography>{tech.description}</Typography>
                    <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<ExportSquare />}
                        component={tech.label === 'React MUI' ? RouterLink : Link}
                        {...(tech.label === 'React MUI' ? { to: tech.url + getQueryParams } : { href: tech.url + getQueryParams })}
                        target={tech.target}
                        sx={(theme) => ({
                          fontWeight: 500,
                          bgcolor: 'secondary.light',
                          color: 'secondary.darker',
                          ...theme.applyStyles('light', { '&:hover': { color: 'secondary.lighter' } })
                        })}
                      >
                        Preview
                      </Button>
                      {!(tech.free == null) && (
                        <Link component={RouterLink} to={tech.url}>
                          <IconButton
                            size="large"
                            shape="rounded"
                            color="secondary"
                            variant="light"
                            aria-label="GitHub repository"
                            sx={(theme) => ({
                              bgcolor: 'secondary.light',
                              color: 'secondary.darker',
                              '&:hover': {
                                color: 'secondary.lighter',
                                bgcolor: 'secondary.800',
                                svg: { stroke: theme.vars.palette.common.white },
                                ...theme.applyStyles('dark', { bgcolor: 'background.default' })
                              }
                            })}
                          >
                            <GithubIcon />
                          </IconButton>
                        </Link>
                      )}
                    </Stack>
                  </Stack>
                </MainCard>
              </FadeInWhenVisible>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
