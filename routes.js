const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Zhen Zhang, Joey Zhao, Leng He, Dingyuan Liu';
  const pennKey = 'ZHENZH';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /top3weathercity
const top3weathercity = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey

  //const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
  SELECT station_name, AVG(avg_feel) FROM Weather
  left join WeatherStation
  ON WeatherStation.stid = Weather.station
  GROUP BY station_name
  ORDER BY AVG(avg_feel) DESC
  LIMIT 3;
    
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}


// Route 3: GET /earthquake
const earthquake = async function(req, res) {
  connection.query(`
  WITH earthquake AS (
    SELECT SUM(sales) AS sales1, store_nbr
    FROM SalesFinal
    WHERE date BETWEEN '2015-04-26' AND '2015-05-10'
    GROUP BY store_nbr
    ),
    prevyear AS (
    SELECT SUM(sales) AS sales2, store_nbr
    FROM SalesFinal
    WHERE date BETWEEN '2016-05-26' AND '2016-06-10'
    GROUP BY store_nbr
    )
    SELECT AVG(((sales2-sales1)/sales2)) AS prevchange, City
    FROM earthquake e
    JOIN prevyear p ON e.store_nbr = p.store_nbr
    JOIN Stores s ON p.store_nbr = s.StoreNumber
    GROUP BY City
    ORDER BY prevchange DESC; 
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

// Route 4: GET /holidaysales
const holidaysales = async function(req, res) {
  
  connection.query(`
  WITH holiday_sales AS(
    SELECT AVG(sales) AS holiday_sales, h.date
    FROM SalesFinal t
    JOIN Holiday_Events h
    ON t.date = h.date
),
    regular_sales AS (
        SELECT AVG(sales) AS regular_sales, date
        FROM SalesFinal
        WHERE date NOT IN (SELECT date FROM Holiday_Events)
    )
SELECT (holiday_Sales/regular_sales)/regular_sales*100 AS SalesPercentageChangeByHoliday
FROM holiday_sales, regular_sales;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}


// // Route 1: GET /hot-sale-item
// const hotSaleItem = async function(req, res) {
//   const query = `
//     WITH hotcte AS(
//       WITH hot AS (
//         SELECT DISTINCT day
//         FROM Weather
//         WHERE avg_feel > 80
//       )
//       SELECT family, AVG(sales) AS avgsale
//       FROM Sales
//       JOIN Stores ON Sales.store_nbr = Stores.StoreNumber
//       JOIN hot ON Sales.date = hot.day
//       WHERE Stores.City = "Quito"
//       GROUP BY family
//     ),
//     coolcte AS (
//       WITH cool AS (
//         SELECT DISTINCT day
//         FROM Weather
//         WHERE avg_feel <= 80
//       )
//       SELECT family, AVG(sales) AS avgsale
//       FROM Sales
//       JOIN Stores ON Sales.store_nbr = Stores.StoreNumber
//       JOIN cool ON Sales.date = cool.day
//       WHERE Stores.City = "Quito"
//       GROUP BY family
//     )

//     SELECT h.family, (h.avgsale - c.avgsale)/h.avgsale AS hot_percent_change
//     FROM hotcte h
//     JOIN coolcte c ON h.family = c.family
//     ORDER BY hot_percent_change desc
//     LIMIT 5;
//   `;
//   connection.query(query, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }

// Route 2: GET /sales-percent-change
const holidaysalesPercentChange = async function(req, res) {
  const dates1_start = req.query.date1_start ?? '2015-12-22';
  const dates1_end = req.query.date1_end ?? '2015-12-26';
  const dates2_start = req.query.date2_start ?? '2016-12-22';
  const dates2_end = req.query.date2_end ?? '2016-12-26';
  
  const query = `
    WITH sales_1 AS (
      SELECT family, SUM(sales) AS sales_by_family
      FROM SalesFinal
      WHERE date BETWEEN '${dates1_start}' AND '${dates1_end}'
      GROUP BY family
    ),
    sales_2 AS (
      SELECT family, SUM(sales) AS sales_by_family
      FROM SalesFinal
      WHERE date BETWEEN '${dates2_start}' AND '${dates2_end}'
      GROUP BY family
    )

    SELECT A.family, ((B.sales_by_family - A.sales_by_family)/A.sales_by_family) AS pct_change
    FROM sales_1 A
    JOIN sales_2 B
    ON A.family = B.family;
  `;
  
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


const salesbydate = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ? req.query.page_size : 10;
  const offset = (page-1)*pageSize;
  connection.query(`
  select date as date, totalsales
  FROM salesbydate
  LIMIT ${pageSize} OFFSET ${offset};
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const salesbymonth = async function(req, res) {
  const inputmonth = req.query.inputmonth ?? '';
  connection.query(`
  SELECT SUBSTRING(date, 1, 7) as yearmonth,  totalsales
  FROM salesbydate
  WHERE SUBSTRING(date, 1, 7) like "%${inputmonth}%"
  GROUP BY yearmonth;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const salesbyyear = async function(req, res) {
  const inputyear = req.query.inputyear ?? '';
  connection.query(`
  SELECT SUBSTRING(date, 1, 4) as year,  totalsales
  FROM salesbydate
  WHERE SUBSTRING(date, 1, 4) like "%${inputyear}%"
  GROUP BY year;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const salesbycity = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const city = String(req.params.city);
  connection.query(`
  SELECT City, store_nbr, SUM(Sales) totalsales
  FROM SalesFinal JOIN Stores ON SalesFinal.store_nbr = Stores.StoreNumber
  WHERE City = '${city}'
  GROUP BY City, store_nbr
  ORDER BY store_nbr;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const salesbyfamily_search = async function(req, res) {
  const inputFamily = req.query.inputFamily ?? '';
  connection.query(`
  SELECT family, ROUND(TotalSales/1000, 2) AS TotalSales FROM tmp5
  WHERE family like "%${inputFamily}%" LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const sales_correlation  = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey

  //const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
  WITH T1 AS (
    SELECT DATE_FORMAT(date, '%Y-%u') AS week, family, SUM(sales) AS sales_by_family
    FROM SalesFinal GROUP BY week, family
  ),
  T2 AS (
    SELECT DATE_FORMAT(Date, '%Y-%u') AS week, AVG(OilPrice) AS weekly_oil_price FROM OilPrice
    GROUP BY week
  )
  SELECT T1.family, (SUM(T1.sales_by_family*T2.weekly_oil_price) -
  (SUM(T1.sales_by_family)*SUM(T2.weekly_oil_price))/COUNT(*)) / SQRT((SUM(T1.sales_by_family*T1.sales_by_family)- (SUM(T1.sales_by_family)*SUM(T1.sales_by_family))/COUNT(*))* (SUM(T2.weekly_oil_price*T2.weekly_oil_price)- (SUM(T2.weekly_oil_price)*SUM(T2.weekly_oil_price))/COUNT(*))) AS corr
  FROM T1
  JOIN T2
  ON T1.week = T2.week
  WHERE T1.sales_by_family IS NOT NULL AND T2.weekly_oil_price IS NOT NULL GROUP BY T1.family
  ORDER BY corr DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

const monthly_correlation  = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey

  //const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
  WITH T1 AS (
    SELECT DATE_FORMAT(Date, '%Y-%u') AS month, AVG(OilPrice) AS monthly_oil_price
    FROM OilPrice
    GROUP BY month
  ),
  T2 AS (
    SELECT DATE_FORMAT(date, '%Y-%u') AS month, SUM(transactions) AS sum_transactions
    FROM Transactions
    GROUP BY month
  )
  SELECT (SUM(T1.monthly_oil_price*T2.sum_transactions) - (SUM(T1.monthly_oil_price)*SUM(T2.sum_transactions))/COUNT(*)) / SQRT((SUM(T1.monthly_oil_price*T1.monthly_oil_price)- (SUM(T1.monthly_oil_price)*SUM(T1.monthly_oil_price))/COUNT(*))* (SUM(T2.sum_transactions*T2.sum_transactions)- (SUM(T2.sum_transactions)*SUM(T2.sum_transactions))/COUNT(*))) AS corr
  FROM T1
  INNER JOIN T2
  ON T1.month = T2.month
  WHERE T1.monthly_oil_price IS NOT NULL AND T2.sum_transactions IS NOT NULL;

  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

const weathersalescomparison = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const temperature = String(req.params.temperature);
  connection.query(`
  WITH hotcte AS(
    WITH hot AS (
    SELECT DISTINCT day
    FROM Weather
    WHERE avg_feel > ${temperature})
    SELECT family, AVG(sales) AS avgsale
    FROM Sales
    JOIN Stores ON Sales.store_nbr = Stores.StoreNumber
    JOIN hot ON Sales.date = hot.day
    GROUP BY family),
        coolcte AS(
    WITH cool AS (SELECT DISTINCT day
    FROM Weather
    WHERE avg_feel <= ${temperature})
    SELECT family, AVG(sales) AS avgsale
    FROM Sales
    JOIN Stores ON Sales.store_nbr = Stores.StoreNumber
    JOIN cool ON Sales.date = cool.day
    GROUP BY family)
    
    SELECT h.family, (h.avgsale - c.avgsale)/h.avgsale AS hot_percent_change
    FROM hotcte h
    JOIN coolcte c ON h.family = c.family
    ORDER BY hot_percent_change desc;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const weatherbycitybydate = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const inputCity = req.query.inputCity ?? '';
  const inputDay = req.query.inputDay ?? '';
  connection.query(`
  SELECT station_name city, day, avg_feel, max_temp_f, min_temp_f, concat(day,station_name) as id
  FROM Weather
  JOIN WeatherStation ON Weather.station = WeatherStation.stid
  WHERE station_name like "%${inputCity}%" and day like "%${inputDay}%";
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// const salesbystorenumber = async function(req, res) {
//   // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
//   const storenumber = String(req.params.storenumber);
//   connection.query(`
//   SELECT family, SUM(Sales) totalsales
//   FROM SalesFinal
//   WHERE family = '${family}'
//   GROUP BY family;
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data);
//     }
//   });
// }

// Route 2: GET /store info
const storeinfo = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey

  //const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.

  const page = req.query.page;
  const pageSize = req.query.page_size ? req.query.page_size : 10;
  const offset = (page-1)*pageSize;
  connection.query(`
  SELECT StoreNumber, City, State, Type, Cluster, FORMAT(DailySales,2) AS DailySales FROM salesbystore
  LIMIT ${pageSize} OFFSET ${offset}
  ;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

// StoreSearch
const storeSearch = async function(req, res) {
  const inputCity = req.query.inputCity ?? '';
  const inputState = req.query.inputState ?? '';
  const inputType = req.query.inputType ?? '';
  const inputCluster = req.query.inputCluster ?? '';
  
  connection.query(`
  SELECT StoreNumber, City, State, Type, Cluster, FORMAT(DailySales,2) AS DailySales FROM salesbystore
  WHERE City like "%${inputCity}%"  AND State like "%${inputState}%" AND Type like "%${inputType}%" AND Cluster like "%${inputCluster}%"
  ;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

const transactionSearch = async function(req, res) {
  const inputCity = req.query.inputCity ?? '';
  const inputDate = req.query.inputDate ?? '';
  connection.query(`
  With Wea AS(
    SELECT station_name city, day, avg_feel, max_temp_f, min_temp_f, CONCAT(station_name, day) id
    FROM Weather
    JOIN WeatherStation ON Weather.station = WeatherStation.stid
    ),
        Trans AS (
    SELECT date, city, SUM(transactions) total_transaction, AVG(transactions) avg_transaction, CONCAT(city, date) id
    FROM Transactions t
    JOIN Stores s ON t.store_nbr = s.StoreNumber
    GROUP BY date, city
        )
    SELECT Wea.city City, CAST(date as char(10)) date, avg_feel, max_temp_f, min_temp_f, total_transaction, avg_transaction, Wea.id
    FROM Wea JOIN Trans ON Wea.id = Trans.id WHERE date like "%${inputDate}%" AND Wea.city like "%${inputCity}%"
  
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  author,
  top3weathercity,
  earthquake,
  holidaysales,
  //hotSaleItem,
  holidaysalesPercentChange,
  salesbydate,
  salesbymonth,
  salesbyyear,
  salesbycity,
  salesbyfamily_search,
  sales_correlation,
  monthly_correlation,
  weathersalescomparison,
  weatherbycitybydate,
  storeinfo,
  storeSearch,
  transactionSearch,
}
