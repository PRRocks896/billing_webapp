import { ReactNode, SyntheticEvent, useState } from 'react';

// material-ui
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import AccordionGroup from 'components/@extended/AccordionGroup';

// assets
import { Add, Minus } from 'iconsax-reactjs';

const Strong = ({ children }: { children: ReactNode }) => (
  <Typography component="strong" sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600, color: 'secondary.600' }}>
    {children}
  </Typography>
);
const StyledLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} target="_blank" sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600, textDecoration: 'none', color: 'primary.main' }}>
    {children}
  </Link>
);

// data
const faqData = {
  heading: 'Got Questions? We’ve Got Answers.',
  description: 'Find quick answers to common questions about features, setup, licenses, refunds, and support.',
  defaultExpanded: 2,
  faqList: [
    {
      question: 'What is Lorem Ipsum?',
      answer: (
        <>
          <Strong>Lorem Ipsum</Strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        </>
      )
    },
    {
      question: 'Why do we use it?',
      answer: (
        <>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The
          point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English.
        </>
      )
    },
    {
      question: 'Where does it come from?',
      answer: (
        <>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45
          BC, making it over 2000 years old.
        </>
      )
    },
    {
      question: 'Where can I get some?',
      answer: (
        <>
          There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
          injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum,
          you need to be sure there isn't anything embarrassing hidden in the middle of text.
        </>
      )
    },
    {
      question: 'The standard Lorem Ipsum passage, used since the 1500s',
      answer: (
        <>YLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</>
      )
    },
    {
      question: 'Are there modern versions of Lorem Ipsum?',
      answer: (
        <>
          Yes, many variations exist today — some humorous, themed, or even translated versions like “Cupcake Ipsum,” “Hipster Ipsum,” and
          “Corporate Ipsum.”
        </>
      )
    },
    {
      question: 'Why do designers use Lorem Ipsum?',
      answer: (
        <>
          It helps designers focus on layout and typography without being distracted by readable content.
          <StyledLink href="https://www.lipsum.com/">🔗 Why designers still use Lorem Ipsum </StyledLink>
        </>
      )
    },
    {
      question: 'Is Lorem Ipsum still used today?',
      answer: (
        <>
          Absolutely. Even in digital design, web development, and app UI mockups, Lorem Ipsum remains the industry standard for placeholder
          text.
        </>
      )
    }
  ]
};

// ==============================|| FAQ PAGE ||============================== //

export default function FaqPage() {
  const [expanded, setExpanded] = useState<number | false>(faqData.defaultExpanded);

  const handleChange = (panel: number) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container spacing={12} sx={{ justifyContent: 'center', alignItems: 'center', mt: { xs: 15, lg: 21 }, mb: { xs: 6.5, lg: 12 } }}>
      <Grid size={{ xs: 12, sm: 10, lg: 9 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 2 } }}>
          <Stack sx={{ gap: { xs: 3.75, sm: 5, lg: 6.25 } }}>
            <Stack spacing={2} sx={{ textAlign: 'center', mb: 3, pt: 3 }}>
              <Typography variant="h2">{faqData.heading}</Typography>
              <Typography>{faqData.description}</Typography>
            </Stack>
            <AccordionGroup
              sx={{
                gap: { xs: 1.5, sm: 2, lg: 2.5 },
                '& .MuiAccordion-root:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' }
              }}
            >
              {faqData.faqList.map((faq, index) => (
                <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                  <AccordionSummary
                    expandIcon={
                      expanded === index ? (
                        <Box sx={{ fontSize: { xs: 14, sm: 16, lg: 18 } }}>
                          <Add style={{ transform: 'rotate(90deg)', fontSize: 'inherit' }} />
                        </Box>
                      ) : (
                        <Box sx={{ fontSize: { xs: 14, sm: 16, lg: 18 } }}>
                          <Minus style={{ fontSize: 'inherit' }} />
                        </Box>
                      )
                    }
                    sx={{ gap: 1 }}
                  >
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, sm: 18, lg: 20 }, fontWeight: 500 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography variant="h5" sx={{ color: 'text.secondary', fontSize: { xs: 14, sm: 16 }, fontWeight: 400 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionGroup>
            <Stack sx={{ gap: { xs: 1.5, sm: 2, lg: 2.5 } }}>
              <Typography variant="h4" sx={{ fontSize: { xs: 16, sm: 18, lg: 20 }, fontWeight: 500 }}>
                Still have a question?
              </Typography>
              <Typography variant="h5" sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 400 }}>
                If you can’t find the answer you’re looking for, please don’t hesitate to{' '}
                <Link href="./contact-us" target="_blank">
                  Contact Us
                </Link>{' '}
                — we’re always here to help!
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Grid>
    </Grid>
  );
}
