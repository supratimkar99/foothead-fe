import React, { useContext } from 'react'

import Typography from '@mui/material/Typography';

import TournamentsTable from './TournamentsTable';
import TournamentsTableCollapsable from './TournamentsTableCollapsable';
import { ApplicationContext } from '../App';

const Tournaments = () => {
  const { windowWidth } = useContext(ApplicationContext);

  const tournamnetsTable = (
    windowWidth > 600 ? <div style={{ paddingBottom: '5px' }}> <TournamentsTable /> </div> : <TournamentsTableCollapsable />
  );

  const pageHeader = windowWidth > 600 ? (
    <div style={{ textAlign: 'center' }}>
      <Typography variant={'h1'} fontFamily={'Glitch'} >Touraments</Typography>
    </div>
  ) : null;

  return (
    <>
      {pageHeader}
      {tournamnetsTable}
    </>
  )
}

export default Tournaments;