// material-ui
import { Palette } from '@mui/material/styles';

// third-party
import { Page, View, Document, StyleSheet, Image, Text, Link, Svg, Path } from '@react-pdf/renderer';

// project-imports
import { ThemeMode } from 'config';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// types
import { CustomerList } from 'types/customer';

function SmsIcon({ size = 12, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LocationIcon({ size = 12, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z" stroke={color} strokeWidth={1.5} />
      <Path
        d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function CallIcon({ size = 12, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.414 28.414 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M18.5 9c0-.6-.47-1.52-1.17-2.27-.64-.69-1.49-1.23-2.33-1.23M22 9c0-3.87-3.13-7-7-7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ size = 12, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M13.5 12c0 3.18-2.57 5.75-5.75 5.75S2 15.18 2 12s2.57-5.75 5.75-5.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const getStyles = (currentPalette: Palette) => {
  const borderColor = currentPalette.mode === ThemeMode.LIGHT ? currentPalette.grey[200] : currentPalette.grey[600];

  return StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: currentPalette.background.paper
    },
    container: {
      border: `1px solid ${borderColor}`,
      padding: 18,
      flexDirection: 'column',
      '@media max-width: 400': {
        flexDirection: 'column'
      }
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16
    },
    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
      objectFit: 'cover'
    },
    CardInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: 14,
      lineHeight: 1.57,
      color: currentPalette.text.primary
    },
    role: {
      fontSize: 10,
      lineHeight: 1.66,
      color: currentPalette.text.secondary
    },
    hr: {
      borderBottom: `1px solid ${borderColor}`,
      paddingTop: 18
      // paddingBottom: 18
    },
    about: {
      paddingTop: 18,
      fontSize: 14,
      lineHeight: 1.57,
      fontWeight: 'demibold',
      color: currentPalette.text.primary,
      paddingBottom: 18
    },
    IconContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    IconRow: {
      width: '48%',
      gap: 10,
      paddingBottom: 10
    },
    iconTitle: {
      fontSize: 10,
      lineHeight: 1.57,
      color: currentPalette.text.secondary
    },
    chip: {
      border: `1px solid ${borderColor}`,
      alignItems: 'center',
      borderRadius: '4px',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 8
    },
    chipTitle: {
      color: currentPalette.text.secondary,
      fontSize: '10px',
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 4,
      paddingTop: 4
    },
    timer: {
      marginTop: 25
    }
  });
};

interface Props {
  customer: CustomerList;
  currentPalette: Palette;
}

// ==============================|| CUSTOMER - CARD ||============================== //

export default function ListSmallCard({ customer, currentPalette }: Props) {
  const styles = getStyles(currentPalette);

  return (
    <Document title={`${customer?.fatherName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Image style={styles.image} src={getImageUrl(`avatar-${!customer.avatar ? 1 : customer.avatar}.png`, ImagePath.USERS)} />
            <View style={styles.CardInfo}>
              <Text style={styles.title}>{customer.fatherName}</Text>
              <Text style={styles.role}>{customer.role}</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View>
            <Text style={styles.about}>Hello, {customer.about}</Text>
          </View>
          <View style={styles.IconContainer}>
            <View style={[styles.row, styles.IconRow]}>
              <SmsIcon color={currentPalette.secondary.main} />
              <Text style={styles.iconTitle}>{customer.email}</Text>
            </View>
            <View style={[styles.row, styles.IconRow]}>
              <LocationIcon color={currentPalette.secondary.main} />
              <Text style={styles.iconTitle}>{customer.country}</Text>
            </View>
          </View>
          <View style={styles.IconContainer}>
            <View style={[styles.row, styles.IconRow]}>
              <CallIcon color={currentPalette.secondary.main} />
              <Text style={styles.iconTitle}>{customer.contact}</Text>
            </View>
            <View style={[styles.row, styles.IconRow]}>
              <EyeIcon color={currentPalette.secondary.main} />
              <Link
                style={[styles.iconTitle, { color: currentPalette.primary.main }]}
                src={`https://${customer.firstName}.en`}
              >{`https://${customer.firstName}.en`}</Link>
            </View>
          </View>
          <View style={[styles.row, { gap: 1, paddingTop: 18 }]}>
            {customer.skills.map((skill: string, index: number) => (
              <View style={styles.chip} key={index}>
                <Text style={styles.chipTitle}>{skill}</Text>
              </View>
            ))}
          </View>
          <View style={styles.timer}>
            <Text style={styles.iconTitle}> Updated in {customer.time}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
