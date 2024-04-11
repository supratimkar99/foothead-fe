import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackBar = ({
  alertType, 
  dismissAlert,
  alertText
}) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dismissAlert();
  };

  const alert = (
    <Alert
      onClose={handleClose}
      severity={alertType || 'success'}
      variant={'filled'}
      sx={{ width: '100%' }}
    >
      {alertText}
    </Alert>
  )

  return (
    <Snackbar open={alertType} autoHideDuration={3000} onClose={handleClose}>
      {alert}
    </Snackbar>
  );
}

export default SnackBar;
