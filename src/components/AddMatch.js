import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '../utils/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import NumberInput from '../utils/CustomNumberInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const styles = {
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: '-webkit-center',
    '@media (max-width: 800px)': {
      width: '80%'
    }
  },
  versusText: {
    mr: 5,
    ml: 5,
    '@media (max-width: 800px)': {
      mr: 2,
      ml: 2,
    }
  }
}

 
const AddMatch = ({
  isModalOpen,
  tournaments,
  selectedTournament,
  selectedStage,
  handleModalClose,
  tournamentOptions,
  setSelectedTournament,
  setSelectedStage,
  scoreline,
  updateScoreline,
  handleAddButtonClick,
  shouldPersistValue,
  handleCheckboxSwitch,
}) => {
  const checkDataValidity = () => {
    if ( scoreline.homePlayer !== null && scoreline.homeScore !== null ) {
      return true;
    } else {
      return false;
    }
  }

  const closeButton = (
    <div style={{
      position: 'absolute',
      top: '5px',
      right: '5px',
      padding: '5px',
      borderRadius: '5px'
    }}>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </div>
  )

  const modal = (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles.modalBox}>
        {closeButton}
        <Typography id="modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
          Add Match
        </Typography>
        <Autocomplete
          id="tournament-name"
          value={selectedTournament}
          onChange={(event, newValue) => {
            setSelectedTournament(newValue || null);
          }}
          disablePortal
          options={tournaments ? tournaments.sort((a, b) => a.serialNumber > b.serialNumber ? -1 : 1) : []}
          getOptionDisabled={(option) => 
            option.stages === undefined || option.stages?.length === 0
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={!tournaments}
          getOptionLabel={(option) => option.name}
          sx={{ width: '60%', mt: 2 }}
          renderInput={(params) => <TextField {...params} label="Tournament" InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {!tournaments ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            }} />
          }
        />

        <Autocomplete
          id="stage-name"
          value={selectedStage}
          onChange={(event, newValue) => {
            setSelectedStage(newValue || null);
          }}
          disablePortal
          disabled={!selectedTournament}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={tournamentOptions.stages || []}
          loading={!tournamentOptions.stages}
          getOptionLabel={(option) => option.type}
          sx={{ width: '60%', mt: 4 }}
          renderInput={(params) => <TextField {...params} label="Stage" InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {!tournamentOptions.stages && selectedTournament ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            }} />
          }
        />

        <Box id='score-box' sx={{ display: 'flex', mt: 4, alignItems: 'center', justifyContent: 'center' }}>

          <Box id='home-score-box' sx={{ width: '40%', textAlign: '-webkit-left' }}>
            <Autocomplete
              id="home-player"
              value={scoreline.homePlayer}
              onChange={(event, newValue) => {
                updateScoreline({...scoreline, homePlayer: newValue})
              }}
              disablePortal
              disabled={!selectedTournament}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={tournamentOptions.players || []}
              loading={!tournamentOptions.players}
              getOptionLabel={(option) => option.player + (option.team ? ' - ' + option.team : '') }
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Home" InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {!tournamentOptions.players && selectedTournament ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
                }} />
              }
            />
            <NumberInput
              aria-label={'home-score'}
              placeholder={'Home Score'}
              value={scoreline.homeScore}
              onChange={(event, val) =>  updateScoreline({...scoreline, homeScore: val})}
              sx={{ mt:2, width: '70%' }}
              min={0}
            />
          </Box>

          <Typography id="modal-modal-title" variant="h6" component="h4" sx={styles.versusText}>
            vs
          </Typography>

          <Box id='away-score-box' sx={{ width: '40%', textAlign: '-webkit-right' }}>
            <Autocomplete
              id='away-player'
              value={scoreline.awayPlayer}
              onChange={(event, newValue) => {
                updateScoreline({...scoreline, awayPlayer: newValue})
              }}
              disablePortal
              disabled={!selectedTournament}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={tournamentOptions.players || []}
              loading={!tournamentOptions.players}
              getOptionLabel={(option) => option.player + (option.team ? ' - ' + option.team : '') }
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Away" InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {!tournamentOptions.players && selectedTournament ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
                }} />
              }
            />
            <NumberInput
              aria-label={'away-score'}
              placeholder={'Away Score'}
              value={scoreline.awayScore}
              onChange={(event, val) =>  updateScoreline({...scoreline, awayScore: val})}
              sx={{ mt:2, width: '70%' }}
              min={0}
            />
          </Box>
        </Box>

        <Button
          sx={{ mt: 4, mb: 2, }}
          disabled={!checkDataValidity()}
          onClick={handleAddButtonClick}
        >
          ADD
        </Button>

        <br />

        <Checkbox
          aria-label={'persist-values'}
          size={'small'}
          sx={{ p: 0.5 }}
          checked={shouldPersistValue}
          onChange={handleCheckboxSwitch}
        />
        
        <Typography id="persist-values-checkbox-label" variant="caption" >Conitnue Adding</Typography>

      </Box>
    </Modal>
  );

  return (
    <>
      {modal}
    </>
  )
}
 
export default AddMatch;