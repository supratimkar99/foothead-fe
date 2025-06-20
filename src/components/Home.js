import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ApplicationContext } from '../App';

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

const gridItemIndividual = ( name, imageNameSuffix ) => {
  return (
    <Grid item sm={4} xs={12}>
      <Link to={`/${name}`} style={{ textDecoration: 'none' }}>
        <Card raised={true} >
          <CardActionArea>
            <CardMedia
              component="img"
              src={require(`../../public/media/${name}_bgm${imageNameSuffix}.webp`)}
              alt={name}
              style={styles.media}
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

const Home = () => {
  const { windowWidth } = useContext(ApplicationContext);
  let headerComponent, imageNameSuffix;
  if (windowWidth > 600) {
    headerComponent = (
      <>
        {/* <Typography sx={{ mt: 2 }} variant={'h4'} >Welcome to</Typography> */}
        <Typography variant={'h1'} fontFamily={'Glitch'}>Welcome to FootHead!</Typography>
      </>
    );
    imageNameSuffix = '';
  } else {
    headerComponent = (
      <>
        <Typography sx={{ mt: 2 }} variant={'h5'} >Welcome to</Typography>
        <Typography variant={'h2'} fontFamily={'Glitch'} sx={{ mt: -2, mb: -1 }}>FootHead</Typography>
      </>
    );
    imageNameSuffix = '_xs';
  }

  return (
    <Container sx={{ textAlign: 'center' }}>
      {headerComponent}
      <Box sx={{ flexGrow: 1, p: 1, mt: 1, height: '50%' }}>
        <Grid container spacing={5} >
          {gridItemIndividual('players', imageNameSuffix)}
          {gridItemIndividual('matches', imageNameSuffix)}
          {gridItemIndividual('tournaments', imageNameSuffix)}
        </Grid>
      </Box>
    </Container>
  )
}

export default Home;