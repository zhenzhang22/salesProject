const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);
app.get('/top3weathercity', routes.top3weathercity);
app.get('/earthquake',routes.earthquake);
app.get('/holidaysales', routes.holidaysales);
//app.get('/hotSaleItem', routes.hotSaleItem);
app.get('/holidaysalesPercentChange', routes.holidaysalesPercentChange);
app.get('/salesbydate', routes.salesbydate);
app.get('/salesbymonth', routes.salesbymonth);
app.get('/salesbyyear', routes.salesbyyear);
app.get('/salesbycity/:city', routes.salesbycity);
app.get('/salesbyfamily_search', routes.salesbyfamily_search);
app.get('/sales_correlation', routes.sales_correlation);
app.get('/monthly_correlation', routes.monthly_correlation);
app.get('/weathersalescomparison/:temperature', routes.weathersalescomparison);
app.get('/weatherbycitybydate', routes.weatherbycitybydate);
app.get('/storeinfo', routes.storeinfo);
app.get('/storeSearch', routes.storeSearch);
app.get('/transactionSearch', routes.transactionSearch);
// app.get('/album/:album_id', routes.album);
// app.get('/albums', routes.albums);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
