const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'INVENTORY_MANAGEMENT_DB'
})

connection.connect()

app.get('/cars', (req, res) => {
    let query = "SELECT VEHICLE.VIN, COLOR, YEAR, MILEAGE, IMAGE, BRAND, MODEL, QUANTITY, PRICE \
        FROM VEHICLE \
        LEFT OUTER JOIN VEHICLE_TYPE ON VEHICLE.VEHICLE_TYPE_ID = VEHICLE_TYPE.VEHICLE_TYPE_ID \
        LEFT OUTER JOIN INVENTORY ON VEHICLE.VIN = INVENTORY.VIN;"

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.json({cars: rows});
        connection.end();
    })
})

app.post('/cars', (req, res) => {
    let car = req.body.car;

    let vehicleTypeQuery = `INSERT INTO VEHICLE_TYPE (BRAND, MODEL) \
        VALUES (${addQuotes(car.brand)}, ${addQuotes(car.model)});`

    connection.query(vehicleTypeQuery, function (err, rows, fields) {
        if (err) throw err
        
        let vehicleQuery = `INSERT INTO VEHICLE \
            VALUES (${addQuotes(car.vin)}, ${addQuotes(rows.insertId)}, ${addQuotes(car.color)}, ${addQuotes(car.year)}, ${addQuotes(car.mileage)}, ${addQuotes(car.image)})`

        connection.query(vehicleQuery, function (err, rows, fields) {
            if (err) throw err

            let inventoryQuery = `INSERT INTO INVENTORY (VIN, QUANTITY, PRICE) \
                VALUES (${addQuotes(car.vin)}, ${addQuotes(car.quantity)}, ${addQuotes(car.price)})`
    
            connection.query(inventoryQuery, function (err, rows, fields) {
                if (err) throw err
                res.json("success");
                connection.end();
            })
        })
    })
})

app.put('/cars/:vin', (req, res) => {
    let vin = req.params.vin
    let car = req.body.car

    let vehicleTypeQuery = `UPDATE VEHICLE_TYPE (BRAND, MODEL) \
        VALUES (${addQuotes(car.brand)}, ${addQuotes(car.model)});`

    connection.query(vehicleTypeQuery, function (err, rows, fields) {
        if (err) throw err
        
        let vehicleQuery = `INSERT INTO VEHICLE \
        VALUES (${addQuotes(car.vin)}, ${addQuotes(rows.insertId)}, ${addQuotes(car.color)}, ${addQuotes(car.year)}, ${addQuotes(car.mileage)}, ${addQuotes(car.image)})`

        connection.query(vehicleQuery, function (err, rows, fields) {
            if (err) throw err

            let inventoryQuery = `INSERT INTO INVENTORY (VIN, QUANTITY, PRICE) \
            VALUES (${addQuotes(car.vin)}, ${addQuotes(car.quantity)}, ${addQuotes(car.price)})`
    
            connection.query(inventoryQuery, function (err, rows, fields) {
                if (err) throw err
                res.json("success");
                connection.end();
            })
        })
    })
})

app.delete('/cars/:vin', (req, res) => {
    
})

app.get('/cars/:vin/image', (req, res) => {
    
})

app.post('/cars/:vin/image', (req, res) => {
    
})

function addQuotes(value) {
    return (typeof value == "string") && (value != null) ? `'${value}'` : value;
}

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})