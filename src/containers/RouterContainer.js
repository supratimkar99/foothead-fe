import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import NavBar from '../components/NavBar';
import Players from '../components/Players';
import Player from '../components/Player';
import Matches from '../components/Matches';
import Tournaments from '../components/Tournaments';

const RouterContainer = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<Player />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<Matches />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Route>
      </Routes>
    </>
  );
}

export default RouterContainer;
