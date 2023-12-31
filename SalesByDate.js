import { useEffect, useState } from 'react';
import { Container, Divider, Link,Button, Checkbox, FormControlLabel, Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LazyTable from '../components/LazyTable';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, LineChart, Line, CartesianGrid, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
const config = require('../config.json');

export default function Storeinfo() {
  const [inputmonth, setinputmonth] = useState('');
  const [inputyear, setinputyear] = useState('');
  const [Data, setData] = useState('');
  const [Dataa, setDataa] = useState('');
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbymonth`)
      .then(res => res.json())
      .then(resJson => {
        const searchedmonth = resJson.map((month) => ({ id: month.yearmonth, ...month }));
        setData(searchedmonth);
      });
  }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbyyear`)
      .then(res => res.json())
      .then(resJson => {
        const searchedmonth = resJson.map((month) => ({ id: month.year, ...month }));
        setDataa(searchedmonth);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbymonth?inputmonth=${inputmonth}`
    )
      .then(res => res.json())
      .then(resJson => {
        const searchedmonth = resJson.map((month) => ({ id: month.yearmonth, ...month }));
        setData(searchedmonth);
      });
  }
  console.log(Data);

  const search2 = () => {
    fetch(`http://${config.server_host}:${config.server_port}/salesbyyear?inputyear=${inputyear}`
    )
      .then(res => res.json())
      .then(resJson => {
        const searchedmonth = resJson.map((month) => ({ id: month.year, ...month }));
        setDataa(searchedmonth);
      });
  }
  const DateColumns = [
    {
      field: 'date',
      headerName: 'date',
      width:400
    },
    {
      field: 'totalsales',
      headerName: 'totalsales',
      width:400
    },
  ];
  const DateColumns1 = [
    {
      field: 'yearmonth',
      headerName: 'date',
      width:400
    },
    {
      field: 'totalsales',
      headerName: 'totalsales',
      width:400
    },
  ];
  const DateColumns2 = [
    {
      field: 'year',
      headerName: 'date',
      width:400
    },
    {
      field: 'totalsales',
      headerName: 'totalsales',
      width:400
    },
  ];
  return (
    <Container>
      <h2>Date Information</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/salesbydate`} columns={DateColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]}/>
      <Divider/>
      <h2>Searched by Year-Month Results</h2>
      
      <Grid item xs={12}>
        <TextField label='yearmonth' value={inputmonth} onChange={(e) => setinputmonth(e.target.value)} style={{ width: "20%" }}/>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <DataGrid
        rows={Data}
        columns={DateColumns1}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <h1>Bar Chart of searched by Year-Month Results</h1>
      <ResponsiveContainer height={250} >
        <BarChart width={600} height={600} data={Data}>
        <Bar dataKey="totalsales" fill="#3399ff" />
        <XAxis dataKey="yearmonth" />
        <YAxis />
        </BarChart>
      </ResponsiveContainer>
      
      <Divider/>
      {/* <h2>Searched by Year Results</h2>
      
      <Grid item xs={12}>
        <TextField label='year' value={inputyear} onChange={(e) => setinputyear(e.target.value)} style={{ width: "20%" }}/>
      </Grid>
      <Button onClick={() => search2() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <DataGrid
        rows={Dataa}
        columns={DateColumns2}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      /> */}
    </Container>
  );
};