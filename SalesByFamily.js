import { useEffect, useState } from 'react';
import { Container, Divider, Link,Button, Checkbox, FormControlLabel, Grid, Slider, TextField } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, LineChart, Line, CartesianGrid, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
// import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function SalesByFamily() {
  const [inputFamily, setinputFamily] = useState('');
  const [Data, setData] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbyfamily_search`)
      .then(res => res.json())
      .then(resJson => {
        const searchedFamily = resJson.map((family) => ({ id: family.family, ...family }));
        setData(searchedFamily);
      });
  }, []);
  
//inputCity=${inputCity}&?
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbyfamily_search?inputFamily=${inputFamily}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const searchedFamily = resJson.map((family) => ({ id: family.family, ...family }));
        setData(searchedFamily);
      });
  }


  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const FamilyColumns = [
    {
      field: 'family',
      headerName: 'Family',
      width:300
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'TotalSales',
      headerName: 'Total Sales',
      width:300
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
  ];

  console.log(Data);

  return (
    <Container>
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {/* {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Check out your song of the day:&nbsp;
        <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link>
      </h2> */}

      {/* <h2>Weather Information</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/weatherbycitybydate`} columns={WeatherColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]}/>
      <Divider/>
      <h2>Searched Weather Results</h2> */}
      <h2>Sales by Family - Unit in Thousands</h2>
      <Grid item xs={12}>
        <TextField label='Product Family' value={inputFamily} onChange={(e) => setinputFamily(e.target.value)} style={{ width: "20%" }}/>

      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <DataGrid
        rows={Data}
        columns={FamilyColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <h2>Sales by Family - Unit in Thousands</h2>
      <ResponsiveContainer height={250} >
        <BarChart width={600} height={600} data={Data}>
        <Bar dataKey="TotalSales" fill="#3399ff" />
        <XAxis dataKey="family" />
        <YAxis />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};