import { Activity, CSSProperties, ReactElement, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { ThemeDirection } from 'config';
import navigation from 'menu-items';

// assets
import { ArrowRight2, Buildings2, Home3 } from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';
import { OverrideIcon } from 'types/root';

interface BreadcrumbLinkProps {
  title: string;
  to?: string;
  icon?: string | OverrideIcon;
}

interface BreadCrumbSxProps extends CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface Props {
  card?: boolean;
  custom?: boolean;
  divider?: boolean;
  heading?: string;
  icon?: boolean;
  icons?: boolean;
  links?: BreadcrumbLinkProps[];
  maxItems?: number;
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

// ==============================|| BREADCRUMBS ||============================== //

export default function Breadcrumbs({
  card = false,
  custom = false,
  divider = false,
  heading,
  icon,
  icons,
  links,
  maxItems,
  rightAlign,
  separator,
  title = true,
  titleBottom = true,
  sx,
  ...others
}: Props) {
  const theme = useTheme();
  const location = useLocation();
  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();

  const iconSX = {
    marginRight: theme.direction === ThemeDirection.RTL ? 0 : theme.spacing(0.75),
    marginLeft: theme.direction === ThemeDirection.RTL ? theme.spacing(0.75) : 0,
    width: '1rem',
    height: '1rem',
    color: theme.vars.palette.secondary.main
  };

  let customLocation = location.pathname;

  // only used for component demo breadcrumbs
  if (customLocation.includes('/components-overview/breadcrumbs')) {
    customLocation = '/apps/customer/customer-card';
  }

  useEffect(() => {
    navigation?.items?.map((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        if (menu?.url && menu.url === customLocation) {
          setMain(menu);
          setItem(menu);
        } else {
          getCollapse(menu as { children: NavItemType[]; type?: string });
        }
      }
      return false;
    });
  });

  // set active item state
  const getCollapse = (menu: NavItemType) => {
    if (!custom && menu.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse as { children: NavItemType[]; type?: string });
          if (collapse.url === customLocation) {
            setMain(collapse);
            setItem(collapse);
          }
        } else if (collapse.type && collapse.type === 'item') {
          if (customLocation === collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator!;
  const separatorIcon = separator ? <SeparatorIcon size={12} /> : <ArrowRight2 size={12} />;

  let mainContent;
  let itemContent;
  let breadcrumbContent: ReactElement = <Typography />;
  let itemTitle: NavItemType['title'] = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse' && !main.breadcrumbs) {
    CollapseIcon = main.icon ? main.icon : Buildings2;
    mainContent = (
      <Typography
        {...(main.url && { component: Link, to: main.url })}
        variant="body1"
        sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        color={window.location.pathname === main.url ? 'text.primary' : 'text.secondary'}
      >
        <Activity mode={icons ? 'visible' : 'hidden'}>
          <CollapseIcon style={iconSX} />
        </Activity>
        <SafeFormattedMessage id={main.title} />
      </Typography>
    );

    if (!!custom) {
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={
            card === false
              ? { mb: 3, bgcolor: 'transparent', borderRadius: 0, overflow: 'visible', boxShadow: 'none', ...sx }
              : { mb: 3, ...sx }
          }
          {...others}
          content={card}
          boxShadow={false}
        >
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            spacing={0.5}
            sx={{ justifyContent: rightAlign ? 'space-between' : 'flex-start', alignItems: rightAlign ? 'center' : 'flex-start' }}
          >
            <Grid>
              <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
                <Typography
                  component={Link}
                  to="/"
                  variant="body1"
                  sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                  color="text.primary"
                >
                  <Activity mode={icons ? 'visible' : 'hidden'}>
                    <Home3 style={iconSX} />
                  </Activity>
                  <Activity mode={icon && !icons ? 'visible' : 'hidden'}>
                    <Home3 variant="Bold" style={{ ...iconSX, marginRight: 0 }} />
                  </Activity>
                  <Activity mode={!icon || icons ? 'visible' : 'hidden'}>
                    <SafeFormattedMessage id="home" />
                  </Activity>
                </Typography>
                {mainContent}
              </MuiBreadcrumbs>
            </Grid>
            <Activity mode={title && titleBottom ? 'visible' : 'hidden'}>
              <Grid sx={{ mt: card === false ? 0 : 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  <SafeFormattedMessage id={main.title} />
                </Typography>
              </Grid>
            </Activity>
          </Grid>
          <Activity mode={card === false && divider !== false ? 'visible' : 'hidden'}>
            <Divider sx={{ mt: 2 }} />
          </Activity>
        </MainCard>
      );
    }
  }

  // items
  if ((item && item.type === 'item') || (item?.type === 'group' && item?.url) || custom) {
    itemTitle = item?.title;

    ItemIcon = item?.icon ? item.icon : Buildings2;
    itemContent = (
      <Typography variant="body1" color="text.primary" sx={{ display: 'flex', fontWeight: 500, alignItems: 'center' }}>
        <Activity mode={icons ? 'visible' : 'hidden'}>
          <ItemIcon style={iconSX} />
        </Activity>
        <SafeFormattedMessage id={itemTitle} />
      </Typography>
    );

    let tempContent = (
      <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
        <Typography
          component={Link}
          to="/"
          color="text.secondary"
          variant="h6"
          sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          <Activity mode={icons ? 'visible' : 'hidden'}>
            <Home3 style={iconSX} />
          </Activity>
          <Activity mode={icon && !icons ? 'visible' : 'hidden'}>
            <Home3 variant="Bold" style={{ ...iconSX, marginRight: 0 }} />
          </Activity>
          <Activity mode={!icon || icons ? 'visible' : 'hidden'}>
            <SafeFormattedMessage id="home" />
          </Activity>
        </Typography>
        {mainContent}
        {itemContent}
      </MuiBreadcrumbs>
    );

    if (custom && links && links?.length > 0) {
      tempContent = (
        <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
          {links?.map((link: BreadcrumbLinkProps, index: number) => {
            CollapseIcon = link.icon ? link.icon : Buildings2;

            return (
              <Typography
                key={index}
                {...(link.to && { component: Link, to: link.to })}
                variant="body1"
                sx={{ textDecoration: 'none', fontWeight: 500, ...(link.to && { fontWeight: 400, cursor: 'pointer' }) }}
                color={link.to ? 'text.secondary' : 'text.primary'}
              >
                <Activity mode={link.icon ? 'visible' : 'hidden'}>
                  <CollapseIcon style={iconSX} />
                </Activity>
                <SafeFormattedMessage id={link.title} />
              </Typography>
            );
          })}
        </MuiBreadcrumbs>
      );
    }

    // main
    if (item?.breadcrumbs !== false || custom) {
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={
            card === false
              ? { mb: 3, bgcolor: 'transparent', borderRadius: 0, overflow: 'visible', boxShadow: 'none', ...sx }
              : { mb: 3, ...sx }
          }
          {...others}
          content={card}
          boxShadow={false}
        >
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            spacing={0.5}
            sx={{ justifyContent: rightAlign ? 'space-between' : 'flex-start', alignItems: rightAlign ? 'center' : 'flex-start' }}
          >
            <Activity mode={title && !titleBottom ? 'visible' : 'hidden'}>
              <Grid>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  <SafeFormattedMessage id={custom ? heading : item?.title} />
                </Typography>
              </Grid>
            </Activity>
            <Grid>{tempContent}</Grid>
            <Activity mode={title && titleBottom ? 'visible' : 'hidden'}>
              <Grid sx={{ mt: card === false ? 0 : 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  <SafeFormattedMessage id={custom ? heading : item?.title} />
                </Typography>
              </Grid>
            </Activity>
          </Grid>
          <Activity mode={card === false && divider !== false ? 'visible' : 'hidden'}>
            <Divider sx={{ mt: 2 }} />
          </Activity>
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
}
