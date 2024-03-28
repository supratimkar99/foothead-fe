import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

import AddMatch from './AddMatch';
import MatchesTable from './MatchesTable';
import LoadingOverlay from '../utils/LoadingOverlay';
import SnackBar from '../utils/Snackbar';
import AddSession from './AddSession';
import { verifySession } from '../utils/validateAdmin';
import MatchesTableCollapsable from './MatchesTableCollapsable';
import {
  ADD_MATCH_FAILURE_ALERT_TEXT,
  ADD_MATCH_SUCCESS_ALERT_TEXT,
  ADMIN_LOGIN_FAILURE_ALERT_TEXT,
  ADMIN_LOGIN_SUCCESS_ALERT_TEXT
} from '../constants/textConstants';
import { stageIdentifierConstants } from '../constants/matchIdentifierConstants';
import { ApplicationContext } from '../App';

const styles = {
  addButton: {
    position: 'fixed',
    bottom: '10%',
    right: '5%',
    zIndex: '101'
  }
}

const API_ROOT = process.env.REACT_APP_API_ROOT;

const Matches = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tournaments, setTournaments] = useState(null);
  const [tournamentOptions, setTournamentOptions] = useState({
    players: null,
    stages: null
  });
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [scoreline, updateScoreline] = useState({
    homePlayer: null,
    awayPlayer: null,
    homeScore: 0,
    awayScore: 0
  })
  const [shouldPersistValue, setShouldPersistValue] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoginResult, setAdminLoginResult] = useState(null);

  const { windowWidth } = useContext(ApplicationContext);

  useEffect(() => {
    if (isModalOpen && !tournaments) {
      axios.get(`${API_ROOT}/tournaments`)
      .then((response) => {
        // Handle the successful response here
        let tournamentData = [];
        for (const tournament of response.data) {
          let tournamentObject = {
            id: tournament._id,
            name: tournament.name,
            stages: tournament.stages,
            serialNumber: tournament.serialNumber
          };
          tournamentData.push(tournamentObject);
        }
        setTournaments(tournamentData);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    }
  }, [isModalOpen, tournaments])

  useEffect(() => {
    if (selectedTournament) {
      axios.get(`${API_ROOT}/tournaments/${selectedTournament.id}?getOptions=true`)
      .then((response) => {
        // Handle the successful response here
        setTournamentOptions({ players: response.data.players, stages: response.data.stages });
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    }
  }, [selectedTournament])

  const handleOnClick = () => {
    if ( verifySession() ) {
      setIsModalOpen(true);
    } else {
      setShowAdminLogin(true);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handleCheckboxSwitch = (event) => {
    setShouldPersistValue(event.target.checked);
  }

  const addMatchAsyncCall = () => {
    setAlertType(null);
    setLoading(true);
    const matchData = {
      identifier: selectedTournament.serialNumber+'_'+stageIdentifierConstants[selectedStage.type],
      stageId: selectedStage.id,
      tournamentId: selectedTournament.id,
      scoreline: {
        home: {
          player: scoreline.homePlayer.player,
          team: scoreline.homePlayer.team,
          score: scoreline.homeScore,
        },
        away: {
          player: scoreline.awayPlayer.player,
          team: scoreline.awayPlayer.team,
          score: scoreline.awayScore,
        }
      }
    }
    axios.post(`${API_ROOT}/matches`, matchData)
      .then((response) => {
        // Handle the successful response here
        if (shouldPersistValue) {
          updateScoreline({
            homePlayer: null,
            awayPlayer: null,
            homeScore: 0,
            awayScore: 0
          });
        } else {
          handleModalClose();
          updateScoreline({
            homePlayer: null,
            awayPlayer: null,
            homeScore: 0,
            awayScore: 0
          });
          setSelectedStage(null);
        }
        setLoading(false);
        setAlertType('success');
        // alert('Match added successfully');
      })
      .catch((error) => {
        setLoading(false);
        setAlertType('error');
        // Handle any errors here
        console.error('Error:', error);
        // alert('Error while adding match');
      });
  }

  const modal = (
    <AddMatch
      isModalOpen={isModalOpen}
      tournaments={tournaments}
      selectedTournament={selectedTournament}
      selectedStage={selectedStage}
      handleModalClose={handleModalClose}
      tournamentOptions={tournamentOptions}
      setSelectedTournament={setSelectedTournament}
      setSelectedStage={setSelectedStage}
      scoreline={scoreline}
      updateScoreline={updateScoreline}
      handleAddButtonClick={addMatchAsyncCall}
      shouldPersistValue={shouldPersistValue}
      handleCheckboxSwitch={handleCheckboxSwitch}
    />
  );

  const addButton = (
    // #1976d2 color="primary"
    <Fab
      color="primary"
      aria-label="add"
      variant={"extended"}
      style={styles.addButton}
      onClick={handleOnClick}
    >
      <AddIcon />
      {windowWidth > 600 ? <>&nbsp;&nbsp;Add Matches</> : <>&nbsp;Add</>}
    </Fab>
  );

  const addMatchSnackBar = (
    <SnackBar
      alertType={alertType}
      dismissAlert={() => setAlertType(null)}
      successAlertText={ADD_MATCH_SUCCESS_ALERT_TEXT}
      failureAlertText={ADD_MATCH_FAILURE_ALERT_TEXT}
    />
  );

  const loadingOverlay = (
    <LoadingOverlay isOpen={loading} />
  );

  const addSessionDetails = (
    <AddSession
      isModalOpen={showAdminLogin}
      adminLoginResult={adminLoginResult}
      setAdminLoginResult={setAdminLoginResult}
      handleModalClose={() => setShowAdminLogin(false)}
      openAddMatchModal={() => setIsModalOpen(true)}
    />
  );

  const adminLoginSnackBar = (
    <SnackBar
      alertType={adminLoginResult}
      dismissAlert={() => setAdminLoginResult(null)}
      successAlertText={ADMIN_LOGIN_SUCCESS_ALERT_TEXT}
      failureAlertText={ADMIN_LOGIN_FAILURE_ALERT_TEXT}
    />
  );

  const matchesTable = (
    windowWidth > 1000 ? <MatchesTable /> : <MatchesTableCollapsable />
  );

  const pageHeader = windowWidth > 600 ? (
    <div style={{ textAlign: 'center' }}>
      <Typography variant={'h1'} fontFamily={'Glitch'} >Matches</Typography>
    </div>
  ) : null;

  return (
    <>
      {addSessionDetails}
      {loadingOverlay}
      {addMatchSnackBar}
      {adminLoginSnackBar}
      {modal}
      {addButton}
      {pageHeader}
      {matchesTable}
    </>
  )
}

export default Matches;