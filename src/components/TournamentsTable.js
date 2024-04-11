import React, {useState, useEffect}  from 'react'
import axios from 'axios';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { API_ROOT } from '../constants/apiConstants';
import LoadingOverlay from '../utils/LoadingOverlay';

const TournamentsTable = () => {
  const [tournaments, setTournaments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_ROOT}/tournaments`)
      .then((response) => {
        // Handle the successful response here
        let tournamentData = [];
        for (const tournament of response.data) {
          const isTeamIncluded = tournament.winner?.team ? true : false;
          let tournamentObject = {
            id: tournament.serialNumber,
            name: tournament.name,
            format: tournament.format,
            status: tournament.status,
            runnersUp: tournament.runnersUp ? (tournament.runnersUp.player + (isTeamIncluded ? ' ('+tournament.runnersUp.team+')' : '')) : '-',
            winner: tournament.winner ? (tournament.winner.player + (isTeamIncluded ? ' ('+tournament.winner.team+')' : '')) : '-',
            participants: tournament.participants?.length,
          };
          tournamentData.push(tournamentObject);
        }
        setTournaments(tournamentData);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [])

  const columns = [
    { field: 'id', type: 'number', headerName: 'No.', width: 75, filterable: false },
    { field: 'name', headerName: 'Name', width: 150, sortable: false, filterable: false },
    { field: 'format', headerName: 'Format', width: 200, sortable: false },
    { field: 'status', headerName: 'Status', width: 125, sortable: false },
    { field: 'participants', type: 'number', headerName: 'Participants', width: 100, align: 'center', filterable: false },
    { field: 'winner', headerName: 'Winner', width: 150, sortable: false },
    { field: 'runnersUp', headerName: 'Runners Up', width: 150, sortable: false },
  ];
  
  const DataTable = (
    <DataGrid
      rows={tournaments || []}
      columns={columns}
      // initialState={{
      //   pagination: {
      //     paginationModel: { page: 0, pageSize: 10 },
      //   },
      // }}
      sx={{ width: 'max-content', pl:1, pr: 1 }}
      pageSizeOptions={[5, 10, 15, 20]}
      disableRowSelectionOnClick
      autoPageSize
      // disableColumnResize={true}
      // loading={loading}
      disableColumnSelector={true}
      disableColumnMenu={true}
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

export default TournamentsTable;