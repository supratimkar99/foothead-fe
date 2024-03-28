import React, { useState, useEffect, createContext } from 'react';
import RouterContainer from './containers/RouterContainer';

const ApplicationContext = createContext();

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const applicationContextValue = {
    windowWidth: windowWidth,
  }
  return (
    <ApplicationContext.Provider value={applicationContextValue}>
      <RouterContainer />
    </ApplicationContext.Provider>
  );
}

export { ApplicationContext }
export default App;
