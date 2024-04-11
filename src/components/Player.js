import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MUILink from '@mui/material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import LoadingOverlay from '../utils/LoadingOverlay';
import { loadStatusConstants } from '../constants/requestStatusConstants';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const styles = {
  cardStyle: {
    // background: 'linear-gradient(90deg, rgba(185,214,209,1) 0%, rgba(254,254,255,1) 43%, rgba(207,180,218,1) 100%)'
    background: 'linear-gradient(180deg, #DBCEF9 5.6%, #FFF 95.05%)'
  }
}

const Player = () => {
  const [playerData, setPlayerData] = useState(null);
  const [matchStats, setMatchStats] = useState({
    loadStatus: loadStatusConstants.NOT_REQUESTED,
    matchStatsData: null,
  })
  const { id } = useParams();
  useEffect(() => {
    axios.get(`${API_ROOT}/players/${id}?includeTourDetails=true`)
      .then((response) => {
        // Handle the successful response here
        setPlayerData(response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [id]);

  const loadMatchStats = () => {
    setMatchStats({
      loadStatus: loadStatusConstants.LOADING,
      matchStatsData: null,
    });
    axios.get(`${API_ROOT}/players/${id}/match_stats`)
      .then((response) => {
        // Handle the successful response here
        setMatchStats({
          loadStatus: loadStatusConstants.LOAD_SUCCESS,
          matchStatsData: response.data,
        });
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
        setMatchStats({
          loadStatus: loadStatusConstants.LOAD_FAILURE,
          matchStatsData: null,
        });
      });
  }

  const trophiesWon = playerData && playerData.tournamentsData.trophies.map((trophyName) => {
    return (
      <Grid item sm={4} xs={12} key={trophyName}>
        <Box sx={{ display: 'flex', justifyContent: 'left', pl: 5 }}>
          <EmojiEventsIcon color={'primary'} fontSize={'large'}/>
          <Typography variant={'h5'}>
            &nbsp;{trophyName}
          </Typography>
        </Box>
      </Grid>
    )
  });

  const individualStats = matchStats.matchStatsData && Object.entries(matchStats.matchStatsData).map(([key, value]) => {
    return (
      <Grid item sm={4} xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'left', pl: 5 }}>
          <Typography variant={'h5'}>
          <><b>{key}</b>:&nbsp;{value}</>
          </Typography>
        </Box>
      </Grid>
    )
  });

  individualStats && individualStats.push(
    <Grid item xs={12}>
        <Box sx={{ justifyContent: 'center', mt: 1 }}>
          <Link to={`/matches/${id}`}>
            <Typography variant={'h6'}>
              View {id}'s Matches
            </Typography>
          </Link>
        </Box>
      </Grid>
  );

  const loadingCards = () => {
    const skeletonElements = [];
    for (let i=0; i<9; i++) {
      skeletonElements.push (
        <Grid item sm={4} xs={12} key={i}>
          <Box sx={{ display: 'flex', justifyContent: 'left', pl: 5 }}>
            <Typography variant={'h5'}>
              <Skeleton sx={{ width: '300px'}} />
            </Typography>
          </Box>
        </Grid>
      )
    }
    return <>{skeletonElements}</>;
  }

  const reachedFinals = playerData && playerData.tournamentsData.finals.map((finalName) => {
    return (
      <Grid item sm={4} xs={12} key={finalName}>
        <Box sx={{ display: 'flex', justifyContent: 'left', pl: 5 }}>
          <MilitaryTechIcon color={'secondary'} fontSize={'large'}/>
          <Typography variant={'h5'}>
            <i>{finalName}</i>
          </Typography>
        </Box>
      </Grid>
    )
  });

  const nameCard = (
    <Grid item sm={4} xs={12}>
      <Card raised={true} style={styles.cardStyle}>
        <CardContent >
          <Typography variant={'h4'} sx={{ textAlign: 'left'}} >
            {playerData?.fullname}
          </Typography>
          <Typography variant={'h1'} fontFamily={'Glitch'} sx={{ textAlign: 'right', mt: 2, mb: -3, mr: 2 }} >
            {playerData?._id}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const tourPlayed = (
    <Grid item sm={4} xs={12}>
      <Card raised={true} style={styles.cardStyle}>
        <CardContent >
          <Typography variant={'h4'} sx={{ textAlign: 'left'}} >
            {'Tournaments Played'}
          </Typography>
          <Typography variant={'h1'} fontFamily={'Glitch'} sx={{ textAlign: 'right', mt: 2, mb: -3, mr: 2 }} >
            {playerData?.tournamentsData?.played}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const tourWon = (
    <Grid item sm={4} xs={12}>
      <Card raised={true} style={styles.cardStyle}>
        <CardContent >
          <Typography variant={'h4'} sx={{ textAlign: 'left'}} >
            {'Tournaments Won'}
          </Typography>
          <Typography variant={'h1'} fontFamily={'Glitch'} sx={{ textAlign: 'right', mt: 2, mb: -3, mr: 2 }} >
            {playerData?.tournamentsData?.won}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const honoursCard = (
    <Grid item xs={12}>
      <Card raised={true} style={styles.cardStyle}>
        <CardContent >
          <Typography variant={'h2'} fontFamily={'Glitch'} sx={{ mb: 2 }}>
            SILVERWARE
          </Typography>
          <Grid container spacing={1} >
            {trophiesWon}
            {reachedFinals}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  const statsCard = (
    <Grid item xs={12}>
      <Card raised={true} style={styles.cardStyle}>
        <CardContent >
          <Typography variant={'h2'} fontFamily={'Glitch'} sx={{ mb: 2 }}>
            MATCH STATS
          </Typography>
          <Grid container spacing={1} >
            {matchStats.loadStatus === loadStatusConstants.LOAD_SUCCESS ? individualStats : loadingCards()}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )

  const loadPlayerDataLink = matchStats.loadStatus === loadStatusConstants.NOT_REQUESTED ? (
    <MUILink
      component="button"
      variant="button"
      underline='hover'
      onClick={loadMatchStats}
      sx={{ mt: 4 }}
      color='#01021c'
    >
      <KeyboardDoubleArrowDownIcon />
      &nbsp; Click Here to load Match Stats &nbsp;
      <KeyboardDoubleArrowDownIcon />
    </MUILink>
  ) : null;

  const content = playerData ? (
    <Container sx={{ flexGrow: 1, p: 2, mt: 2, textAlign: 'center' }}>
      <Grid container spacing={2} >
        {nameCard}
        {tourPlayed}
        {tourWon}
        {honoursCard}
        {matchStats.loadStatus !== loadStatusConstants.NOT_REQUESTED ? statsCard : null}
      </Grid>
      {loadPlayerDataLink}
    </Container>
  ) : <LoadingOverlay isOpen={true} />;

  return (
    <>
      {content}
    </>
  )
}

export default Player;

/*
<Typography variant={'h5'} fontWeight={'bold'}>ID : {playerData._id}</Typography>
<Typography variant={'h5'} fontWeight={'bold'}>Player Name : {playerData.fullname}</Typography>
<Typography variant={'h5'} fontWeight={'bold'}>Tournaments Played : {playerData.tournamentsData.played}</Typography>
<Typography variant={'h5'} fontWeight={'bold'}> Tournaments Won : {playerData.tournamentsData.won}</Typography>
<Typography variant={'h5'} fontWeight={'bold'}>Reached Final : {playerData.tournamentsData.finalist}</Typography>
{trophiesWon.length ? <Typography variant={'h5'} fontWeight={'bold'}>Trophies : </Typography>  : null} {trophiesWon}
*/