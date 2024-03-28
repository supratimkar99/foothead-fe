import React, {useState, useEffect}  from 'react'
import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';

import LoadingOverlay from '../utils/LoadingOverlay';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const TournamentsTable = () => {
  const [tournaments, setTournaments] = useState(null);

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
            runnersUp: tournament.runnersUp ? (tournament.runnersUp.player + (isTeamIncluded ? ' ('+tournament.runnersUp.team+')' : '')) : null,
            winner: tournament.winner ? (tournament.winner.player + (isTeamIncluded ? ' ('+tournament.winner.team+')' : '')) : null,
            participants: tournament.participants?.length,
          };
          tournamentData.push(tournamentObject);
        }
        setTournaments(tournamentData);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [])

  const columns = [
    { field: 'id', headerName: 'No.', width: 50 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'format', headerName: 'Format', width: 200 },
    { field: 'status', headerName: 'Status', width: 125 },
    { field: 'participants', headerName: 'Participants', width: 100, align: 'center' },
    { field: 'winner', headerName: 'Winner', width: 150 },
    { field: 'runnersUp', headerName: 'Runners Up', width: 150 },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];
  
  const DataTable = tournaments ? (
    <DataGrid
      rows={tournaments}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      sx={{ width: 'max-content', pl:1, pr: 1 }}
      pageSizeOptions={[5, 10, 15, 20]}
      disableRowSelectionOnClick
    />
  ) : <LoadingOverlay isOpen={true} />;

  return (
    <>
      {DataTable}
    </>
  )
}

export default TournamentsTable;