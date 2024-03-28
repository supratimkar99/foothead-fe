import React, { useContext } from 'react'

import Typography from '@mui/material/Typography';

import TournamentsTable from './TournamentsTable';
import TournamentsTableCollapsable from './TournamentsTableCollapsable';
import { ApplicationContext } from '../App';

const Tournaments = () => {
  const { windowWidth } = useContext(ApplicationContext);

  const tournamnetsTable = (
    windowWidth > 1000 ? <div style={{ paddingBottom: '20px' }}> <TournamentsTable /> </div> : <TournamentsTableCollapsable />
  );

  const pageHeader = windowWidth > 600 ? (
    <Typography variant={'h1'} fontFamily={'Glitch'} >Touraments</Typography>
  ) : null;

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      {pageHeader}
      {tournamnetsTable}
    </div>
  )
}

export default Tournaments;

/* <Typography variant={'h1'} fontFamily={'Glitch'} >Page under Construction!</Typography>
<Typography variant={'h3'} fontFamily={'Glitch'} >tournaments will be added shortly</Typography> */