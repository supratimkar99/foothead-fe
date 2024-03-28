import React, { useContext } from 'react'
import { AppBar } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Link as RouterLink,
  useLocation,
  Outlet,
} from 'react-router-dom';
import { ApplicationContext } from '../App';

const breadcrumbNameMap = {
  '/players': 'Players',
  '/matches': 'Matches',
  '/tournaments': 'Tournaments',
};

function LinkRouter(props) {
  return <Link {...props} component={RouterLink}/>;
}

const NavBar = () => {
  const { windowWidth } = useContext(ApplicationContext);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const marginValue = windowWidth > 600 ? '60px' : '30px';

  const homeBreadcrumb = pathnames.length === 0 ? null : (
    <LinkRouter to="/" style={{ textDecoration: 'none' }}>
      <Typography fontWeight={'regular'} color={'white'} >
        Home
      </Typography>
    </LinkRouter>
  );

  const appLogo = windowWidth > 600 ? <Typography variant={'h3'} fontFamily={'Glitch'} sx={{ mr: '50px' }} >FOOTHEAD</Typography> :
    <Typography variant={'h3'} fontFamily={'Glitch'} sx={{ mr: '30px' }} >FH</Typography>;
  return (
    <>
      <AppBar
        style={{ paddingLeft: marginValue, backgroundColor: '#01021c', display: '-webkit-box', WebkitBoxAlign: 'center' }}
        position={'sticky'}
      >
        <LinkRouter to="/" style={{ textDecoration: 'none', color: 'white' }}>
          {appLogo}
        </LinkRouter>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="medium" sx={{ color: 'white' }} />}>
          {homeBreadcrumb}
          {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography fontWeight='bold' color="#02faf6" key={to}>
              {breadcrumbNameMap[to] || value}
            </Typography>
          ) : (
            <LinkRouter to={to} key={to} style={{ textDecoration: 'none' }}>
              <Typography fontWeight='regular' color="white" key={to}>
                {breadcrumbNameMap[to] || value}
              </Typography>
            </LinkRouter>
          );
          })}
        </Breadcrumbs>
      </AppBar>
      <Outlet/>
    </>
  )
}

export default NavBar