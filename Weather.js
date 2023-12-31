import { useEffect, useState } from 'react';
import { Container, Divider, Link,Button, Checkbox, FormControlLabel, Grid, Slider, TextField } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, LineChart, ScatterChart, Scatter,Line, CartesianGrid, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
// import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function Weather() {
  const [inputCity, setinputCity] = useState('');
  const [inputDay, setinputDay] = useState('');
  const [Data, setData] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/transactionSearch`)
      .then(res => res.json())
      .then(resJson => {
        const searchedWeather = resJson.map((weather) => ({ id: weather.id, ...weather }));
        setData(searchedWeather);
      });
  }, []);
  
//inputCity=${inputCity}&?
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/transactionSearch?inputCity=${inputCity}&inputDay=${inputDay}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const searchedWeather = resJson.map((weather) => ({ id: weather.id, ...weather }));
        setData(searchedWeather);
      });
  }


  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const WeatherColumns = [
    {
      field: 'City',
      headerName: 'City',
      width:150
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'date',
      headerName: 'Date',
      width:150
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'avg_feel',
      headerName: 'Average Temperature',
      width:150
    },
    {
      field: 'max_temp_f',
      headerName: 'Highest Temperature',
      width:150
    },
    {
      field: 'min_temp_f',
      headerName: 'Lowest Temperature',
      width:150
    },
    {
      field: 'total_transaction',
      headerName: 'Total Transaction',
      width:150
    },
    {
      field: 'avg_transaction',
      headerName: 'Average Transaction',
      width:150
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
      <h2>Transaction by Weather</h2>
      <Grid item xs={12}>
        <TextField label='City' value={inputCity} onChange={(e) => setinputCity(e.target.value)} style={{ width: "20%" }}/>
        <TextField label='Day' value={inputDay} onChange={(e) => setinputDay(e.target.value)} style={{ width: "20%" }}/>

      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <DataGrid
        rows={Data}
        columns={WeatherColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <h2>Scatter Plot - Transaction by Weather</h2>
      <ResponsiveContainer height={250} >
        {/* <BarChart width={600} height={600} data={Data}>
        <Bar dataKey="total_transaction" fill="#3399ff" />
        <Bar dataKey="avg_feel" fill="#FF0000" />
        <XAxis dataKey="date" />
        <YAxis />
        </BarChart> */}
        <ScatterChart width={1000} height={400}>
            <CartesianGrid />
            <XAxis type="number" dataKey="avg_feel"/>
            <YAxis type="number" dataKey="total_transaction" />
            <Scatter data={Data} fill="green" />
        </ScatterChart>
      </ResponsiveContainer>
    </Container>
  );
};