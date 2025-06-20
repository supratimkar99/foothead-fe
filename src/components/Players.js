import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import LoadingOverlay from '../utils/LoadingOverlay';
import { ApplicationContext } from '../App';

const API_ROOT = process.env.REACT_APP_API_ROOT;
const MEDIA_CDN_ROOT = process.env.REACT_APP_MEDIA_CDN_ROOT;

const styles = {
  media: {
    height: "inherit",
    zIndex: 1
  },
  cardContext: {
    padding: 0,
    backgroundColor: '#ebf2ed7'
  },
};

const gridItemIndividual = ( name ) => {
  return (
    <Grid item sm={4} xs={12} key={name}>
      <Link to={`/players/${name}`} style={{ textDecoration: 'none' }}>
        <Card raised={true} >
          <CardActionArea>
            <CardMedia
              component="img"
              src={`${MEDIA_CDN_ROOT}/player_${name}.webp`}
              alt="Players"
              height='250'
              // style={styles.media}
            />
            <CardContent style={styles.cardContext} >
              <Typography variant={'h4'} fontFamily={'Glitch'} >
                {name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
}

const Players = () => {
  const [players, setPlayers] = useState(null);
  const { windowWidth } = useContext(ApplicationContext);
  useEffect(() => {
    axios.get(`${API_ROOT}/players?onlyActive=true`)
      .then((response) => {
        // Handle the successful response here
        setPlayers(response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, []);

  const pageHeader = windowWidth > 600 ? <Typography variant={'h1'} fontFamily={'Glitch'} >Players</Typography> : null;

  const content = players ? (
    <Container sx={{ textAlign: 'center' }}>
      {pageHeader}
      <Box sx={{ flexGrow: 1, p: 1, mt: 1, height: '50%' }}>
        <Grid container spacing={5} >
          {players.map((player) => {
            return gridItemIndividual(player._id);
          })}
        </Grid>
      </Box>
    </Container>
  ) : <LoadingOverlay isOpen={true} />;
  
  return (
    <>
      {content}
    </>
  )
}

export default Players