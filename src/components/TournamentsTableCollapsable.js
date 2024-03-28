import React, {useState, useEffect}  from 'react'
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import LoadingOverlay from '../utils/LoadingOverlay';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const TournamentsTableCollapsable = () => {
  const [tournaments, setTournaments] = useState(null);

  useEffect(() => {
    axios.get(`${API_ROOT}/tournaments`)
      .then((response) => {
        // Handle the successful response here
        let tournamentData = [];
        for (const tournament of response.data) {
          const isTeamIncluded = tournament.winner?.team ? true : false;

          let tournamentObjectArray = [];
          tournamentObjectArray.push(tournament.serialNumber);
          tournamentObjectArray.push(tournament.name);
          tournamentObjectArray.push(tournament.format);
          tournamentObjectArray.push(tournament.status);
          tournamentObjectArray.push(tournament.winner ? (tournament.winner.player + (isTeamIncluded ? ' ('+tournament.winner.team+')' : '')) : null);
          tournamentObjectArray.push(tournament.runnersUp ? (tournament.runnersUp.player + (isTeamIncluded ? ' ('+tournament.runnersUp.team+')' : '')) : null);
          tournamentObjectArray.push(tournament.participants?.length);

          tournamentData.push(tournamentObjectArray);
        }
        setTournaments(tournamentData);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [])

  const columns = [
    { name: 'No.' },
    { name: 'Tournament', options: { sort: false } },
    { name: 'Format', options: { display: 'excluded', filter: false } },
    { name: 'Status', options: { display: 'excluded', filter: false } },
    { name: 'Winner', options: { sort: false } },
    { name: 'Runners Up', options: { display: 'excluded', filter: false } },
    { name: 'Participants', options: { display: 'excluded', filter: false } },
  ];

  const options = {
    // filter: true,
    // onFilterChange: (changedColumn, filterList) => {
    //   console.log(changedColumn, filterList);
    // },
    // filterType: "dropdown",
    rowsPerPage: 15,
    expandableRows: true,
    responsive: 'standard',
    selectableRows: 'none',
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      return (
        <tr>
          <td colSpan={5}>
            <Paper elevation={2} sx={{ pl: 1, pr: 1, pt: 3, pb: 3, fontSize: '14px' }}>
              <Grid container spacing={2} sx={{ textAlign: 'center'}}>
                <Grid item xs={6}>
                  Format: {rowData[2]}
                </Grid>
                <Grid item xs={6}>
                  Status: {rowData[3]}
                </Grid>
                <Grid item xs={6}>
                  Runners Up: {rowData[5]}
                </Grid>
                <Grid item xs={6}>
                  Participants: {rowData[6]}
                </Grid>
              </Grid>
            </Paper>
          </td>
        </tr>
      )  
    },
  }
  
  const DataTable = tournaments ? (
    <MUIDataTable
      data={tournaments}
      columns={columns}
      options={options}
      style={{ maxWidth: 'fit-content'}}
    />
  ) : <LoadingOverlay isOpen={true} />;

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      {DataTable}
    </div>
  )
}

export default TournamentsTableCollapsable;