import React, {useState, useEffect}  from 'react'
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { API_ROOT } from '../constants/apiConstants';
import LoadingOverlay from '../utils/LoadingOverlay';

const MatchesTable = ({ playerId }) => {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParamms = playerId ? `?player=${playerId}` : '';
    axios.get(`${API_ROOT}/matches${queryParamms}`)
      .then((response) => {
        // Handle the successful response here
        let matchData = [];
        for (const match of response.data) {
          const isTeamIncluded = match.scoreline.home.team ? true : false;
          let matchObject = {
            id: match._id,
            identifier: match.identifier,
            tournament: match.tournament.name,
            stage: match.stage.name,
            home: match.scoreline.home.player + (isTeamIncluded ? ' ('+match.scoreline.home.team+')' : ''),
            homeScore: match.scoreline.home.score,
            away: match.scoreline.away.player + (isTeamIncluded ? ' ('+match.scoreline.away.team+')' : ''),
            awayScore: match.scoreline.away.score,
            winner: match.winner ? (match.winner.player + (isTeamIncluded ? ' ('+match.winner.team+')' : '')) : 'DRAW',
            divider: '--'
          };
          matchData.push(matchObject);
        }
        setMatches(matchData);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [playerId])

  const columns = [
    { field: 'tournament', headerName: 'Tournament', width: 200, sortable: false },
    { field: 'stage', headerName: 'Stage', width: 150, sortable: false },
    { field: 'home', headerName: 'Home', width: 150, sortable: false, align: 'right', headerAlign: 'right' },
    { field: 'homeScore', headerName: 'Score', width: 60, sortable: false, align: 'center', filterable: false },
    { field: 'divider', headerName: ' ', width: 5, sortable: false, align: 'center', filterable: false },
    { field: 'awayScore', headerName: 'Score', width: 60, sortable: false, align: 'center', filterable: false },
    { field: 'away', headerName: 'Away', width: 150, sortable: false },
    { field: 'winner', headerName: 'Winner', width: 150, sortable: false },
    { field: 'identifier', headerName: 'Identifier', width: 150, filterable: false },
  ];
  
  const DataTable = (
    <DataGrid
      disableColumnMenu
      rows={matches || []}
      columns={columns}
      // initialState={{
      //   pagination: {
      //     paginationModel: { page: 0, pageSize: 10 },
      //   },
      // }}
      autoPageSize
      pageSizeOptions={[5, 10, 15, 25, 50]}
      sx={{ width: 'max-content', pl:1, pr: 1, mb:2 }}
      disableRowSelectionOnClick
      disableColumnSelector
      slots={{ toolbar: GridToolbar }}
    />
  );

  const windowHeight = loading ? 'auto' : (window.innerHeight * 0.8);
  return (
    <div style={{ textAlign: '-webkit-center', height: windowHeight }}>
      <LoadingOverlay isOpen={loading} />
      {DataTable}
    </div>
  )
}

export default MatchesTable;