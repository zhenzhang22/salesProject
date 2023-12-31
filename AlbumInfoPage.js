// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// import SongCard from '../components/SongCard';
// import { formatDuration, formatReleaseDate } from '../helpers/formatter';
// const config = require('../config.json');

// export default function AlbumInfoPage() {
//   const { album_id } = useParams();

//   const [songData, setSongData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
//   const [albumData, setAlbumData] = useState([]);

//   const [selectedSongId, setSelectedSongId] = useState(null);

//   useEffect(() => {
//     fetch(`http://${config.server_host}:${config.server_port}/album/${album_id}`)
//       .then(res => res.json())
//       .then(resJson => setAlbumData(resJson));

//     fetch(`http://${config.server_host}:${config.server_port}/album_songs/${album_id}`)
//       .then(res => res.json())
//       .then(resJson => setSongData(resJson));
//   }, [album_id]);

//   return (
//     <Container>
//       {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
//       <Stack direction='row' justify='center'>
//         <img
//           key={albumData.album_id}
//           src={albumData.thumbnail_url}
//           alt={`${albumData.title} album art`}
//           style={{
//             marginTop: '40px',
//             marginRight: '40px',
//             marginBottom: '40px'
//           }}
//         />
//         <Stack>
//           <h1 style={{ fontSize: 64 }}>{albumData.title}</h1>
//           <h2>Released: {formatReleaseDate(albumData.release_date)}</h2>
//         </Stack>
//       </Stack>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell key='#'>#</TableCell>
//               <TableCell key='Title'>Title</TableCell>
//               <TableCell key='Plays'>Plays</TableCell>
//               <TableCell key='Duration'>Duration</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {
//               // TODO (TASK 23): render the table content by mapping the songData array to <TableRow> elements
//               // Hint: the skeleton code for the very first row is provided for you. Fill out the missing information and then use a map function to render the rest of the rows.
//               // Hint: it may be useful to refer back to LazyTable.js
//               // <TableRow key={songData[0].song_id}>
//               //   <TableCell key='#'>{songData[0].number}</TableCell>
//               //   <TableCell key='Title'>
//               //     <Link onClick={() => setSelectedSongId(songData[0].song_id)}>
//               //       Replace me
//               //     </Link>
//               //   </TableCell>
//               //   <TableCell key='Plays'>Replace me</TableCell>
//               //   <TableCell key='Duration'>Replace me (use the formatDuration helper function, see SongCard.js for an example)</TableCell>
//               // </TableRow>
//               songData.map(row =>
//                 <TableRow key={row.song_id}>
//                 <TableCell key='#'>{row.number}</TableCell>
//                 <TableCell key='Title'>
//                   <Link onClick={() => setSelectedSongId(row.song_id)}>
//                     {row.title}
//                   </Link>
//                 </TableCell>
//                 <TableCell key='Plays'>{row.plays}</TableCell>
//                 <TableCell key='Duration'>{formatDuration(row.duration)}</TableCell>
//               </TableRow>)




// // {data.map((row, idx) =>
// //   <TableRow key={idx}>
// //     {
// //       // TODO (TASK 19): the next 3 lines of code render only the first column. Modify this with a map statement to render all columns.
// //       // Hint: look at how we structured the map statement to render all the table headings within the <TableHead> element
// //       columns.map(col => (
// //         <TableCell key={col.headerName}>
// //           {/* Note the following ternary statement renders the cell using a custom renderCell function if defined, or defaultRenderCell otherwise */}
// //           {/* {columns[0].renderCell ? columns[0].renderCell(row) : defaultRenderCell(columns[0], row)} */}
// //           {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
// //         </TableCell>
// //       ))
// //     }
// //   </TableRow>
// // )}
//             }
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }