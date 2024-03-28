export const addSessionDetails = () => {
  const now = new Date();
  const expirationTime = now.getTime() + (30 * 60 * 1000);
  localStorage.setItem('adminSessionDetails', JSON.stringify({ expiration: expirationTime }));
}

export const verifySession = () => {
  const storedData = JSON.parse(localStorage.getItem('adminSessionDetails'));
  if (storedData && storedData.expiration > new Date().getTime()) {
    localStorage.removeItem('adminSessionDetails');
    addSessionDetails();
    return true;
  } else {
    localStorage.removeItem('adminSessionDetails');
    return false;
  }
}