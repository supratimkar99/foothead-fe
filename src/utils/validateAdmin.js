export const addSessionDetails = (token) => {
  const now = new Date();
  const expirationTime = now.getTime() + (4 * 60 * 60 * 1000);
  localStorage.setItem('adminSessionDetails', JSON.stringify({ token: token, expiration: expirationTime }));
}

export const verifySession = () => {
  const storedData = JSON.parse(localStorage.getItem('adminSessionDetails'));
  if (storedData && storedData.expiration > new Date().getTime()) {
    return true;
  } else {
    localStorage.removeItem('adminSessionDetails');
    return false;
  }
}