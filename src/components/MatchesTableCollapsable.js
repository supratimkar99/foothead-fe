import React, {useState, useEffect}  from 'react'
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import LoadingOverlay from '../utils/LoadingOverlay';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const MatchesTableCollapsable = () => {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    axios.get(`${API_ROOT}/matches`)
      .then((response) => {
        // Handle the successful response here
        let matchData = [];
        for (const match of response.data) {
          const isTeamIncluded = match.scoreline.home.team ? true : false;
          let matchObjectArray = [];
          matchObjectArray.push(match._id);
          matchObjectArray.push(match.tournament.name);
          matchObjectArray.push(match.stage.name);
          matchObjectArray.push(match.winner ? (match.winner.player + (isTeamIncluded ? ' ('+match.winner.team+')' : '')) : 'DRAW');
          matchObjectArray.push(match.scoreline.home.player + (isTeamIncluded ? ' ('+match.scoreline.home.team+')' : ''));
          matchObjectArray.push(match.scoreline.home.score + ' - ' + match.scoreline.away.score);
          matchObjectArray.push(match.scoreline.away.player + (isTeamIncluded ? ' ('+match.scoreline.away.team+')' : ''));
          matchObjectArray.push(match.identifier);
          matchData.push(matchObjectArray);
        }
        setMatches(matchData);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, []);

  const columns = [
    { name: 'MatchId', options: { display: 'excluded', filter: false } },
    { name: 'Tournament', options: { display: 'excluded', filter: false } },
    { name: 'Stage', options: { display: 'excluded', filter: false } },
    { name: 'Winner', options: { display: 'excluded', filter: false } },
    { name: 'Home', options: { sort: false } },
    { name: 'Score', options: { sort: false } },
    { name: 'Away', options: { sort: false } },
    { name: 'Identifier', options: { display: 'excluded', filter: false } }
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
            <Paper elevation={2} sx={{ pl: 2, pr: 2, pt: 3, pb: 3, fontSize: '14px' }}>
              <Grid container spacing={2} sx={{ textAlign: 'center'}}>
                <Grid item xs={6}>
                  Tournament: {rowData[1]}
                </Grid>
                <Grid item xs={6}>
                  Stage: {rowData[2]}
                </Grid>
                <Grid item xs={6}>
                  Identifer: {rowData[7]}
                </Grid>
              </Grid>
            </Paper>
          </td>
        </tr>
      )  
    },
  }
  
  const DataTable = matches ? (
    <MUIDataTable
      data={matches}
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

export default MatchesTableCollapsable;