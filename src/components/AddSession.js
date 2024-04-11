import React, { useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '../utils/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

import { addSessionDetails } from '../utils/validateAdmin';
import {
  ADMIN_LOGIN_FAILURE_ALERT_TEXT,
  ADMIN_LOGIN_SUCCESS_ALERT_TEXT,
} from '../constants/textConstants';

const styles = {
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: '-webkit-center',
    '@media (max-width: 800px)': {
      width: '80%'
    }
  }
}

const API_ROOT = process.env.REACT_APP_API_ROOT;
 
const AddSession = ({
  isModalOpen,
  handleModalClose,
  openAddMatchModal,
  setAlertData,
}) => {
  const [password, setPassword] = useState('');

  const handleClick = () => {
    const payloadData = {
      password: password
    }
    axios.post(`${API_ROOT}/matches/authenticate`, payloadData)
      .then((response) => {
        setPassword('');
        addSessionDetails(response.data.token);
        handleModalClose();
        openAddMatchModal();
        // alert for successsful login
        setAlertData({
          type: 'success',
          text: ADMIN_LOGIN_SUCCESS_ALERT_TEXT
        });
      })
      .catch((error) => {
        setPassword('');
        // alert for password incorrect
        setAlertData({
          type: 'error',
          text: ADMIN_LOGIN_FAILURE_ALERT_TEXT
        });
      });
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
          Admin Login
        </Typography>
        <Typography sx={{ mt: 2 }} id="persist-values-checkbox-label" variant="body1" >Login with admin credentials to add matches</Typography>
        <TextField
          sx={{ mt: 4 }}
          id="admin login password"
          label="Password"
          variant="outlined"
          value={password}
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <br />
        <Button
          sx={{ mt: 4 }}
          onClick={handleClick}
        >
          LOGIN
        </Button>
      </Box>
    </Modal>
  );

  return (
    <>
      {modal}
    </>
  )
}
 
export default AddSession;