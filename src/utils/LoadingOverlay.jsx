import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingOverlay = ({ isOpen }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: '9999' }}
      open={isOpen}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default LoadingOverlay;