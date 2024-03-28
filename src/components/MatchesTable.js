import React, {useState, useEffect}  from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

import LoadingOverlay from '../utils/LoadingOverlay';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const MatchesTable = () => {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    axios.get(`${API_ROOT}/matches`)
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
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [])

  const columns = [
    { field: 'tournament', headerName: 'Tournament', width: 200, sortable: false },
    { field: 'stage', headerName: 'Stage', width: 150, sortable: false },
    { field: 'home', headerName: 'Home', width: 150, sortable: false, align: 'right', headerAlign: 'right' },
    { field: 'homeScore', headerName: 'Score', width: 50, sortable: false, align: 'center' },
    { field: 'divider', headerName: ' ', width: 5, sortable: false, filterable: false, align: 'center' },
    { field: 'awayScore', headerName: 'Score', width: 50, sortable: false, align: 'center' },
    { field: 'away', headerName: 'Away', width: 150, sortable: false },
    { field: 'winner', headerName: 'Winner', width: 150, sortable: false },
    { field: 'identifier', headerName: 'Identifier', width: 150, filterable: false },
  ];
  
  const DataTable = matches ? (
    <DataGrid
      rows={matches}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      pageSizeOptions={[5, 10, 15, 20]}
      sx={{ width: 'max-content', pl:1, pr: 1, mb:2 }}
      disableRowSelectionOnClick
    />
  ) : <LoadingOverlay isOpen={true} />;

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      {DataTable}
    </div>
  )
}

export default MatchesTable;