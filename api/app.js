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
    let query = `SELECT VEHICLE.VIN, COLOR, YEAR, MILEAGE, IMAGE, BRAND, MODEL, QUANTITY, PRICE
        FROM VEHICLE
        LEFT OUTER JOIN VEHICLE_TYPE ON VEHICLE.VEHICLE_TYPE_ID = VEHICLE_TYPE.VEHICLE_TYPE_ID
        LEFT OUTER JOIN INVENTORY ON VEHICLE.VIN = INVENTORY.VIN;`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.json({cars: rows});
        connection.end();
    })
})

app.post('/cars', (req, res) => {
    let car = req.body.car;

    let vehicleTypeQuery = `INSERT INTO VEHICLE_TYPE (BRAND, MODEL)
        VALUES (${addQuotes(car.brand)}, ${addQuotes(car.model)});`

    connection.query(vehicleTypeQuery, function (err, rows, fields) {
        if (err) throw err
        
        let vehicleQuery = `INSERT INTO VEHICLE (VIN, VEHICLE_TYPE_ID, COLOR, YEAR, MILEAGE)
            VALUES (${addQuotes(car.vin)}, ${addQuotes(rows.insertId)}, ${addQuotes(car.color)}, ${addQuotes(car.year)}, ${addQuotes(car.mileage)})`

        connection.query(vehicleQuery, function (err, rows, fields) {
            if (err) throw err

            let inventoryQuery = `INSERT INTO INVENTORY (VIN, QUANTITY, PRICE)
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

    let inventoryQuery = `UPDATE INVENTORY
        SET QUANTITY = ${addQuotes(car.quantity)}, PRICE = ${addQuotes(car.price)}
        WHERE VIN = ${addQuotes(vin)};`

    connection.query(inventoryQuery, function (err, rows, fields) {
        if (err) throw err
    })

    let vehicleQuery = `UPDATE VEHICLE
        SET COLOR = ${addQuotes(car.color)}, YEAR = ${addQuotes(car.year)}, MILEAGE = ${addQuotes(car.mileage)}}
        WHERE VIN = ${addQuotes(vin)};`

    connection.query(vehicleQuery, function (err, rows, fields) {
        if (err) throw err
    })

    let getVehicleTypeIdQuery = `SELECT VEHICLE_TYPE_ID
        FROM VEHICLE
        WHERE VIN = ${addQuotes(vin)};`

    connection.query(getVehicleTypeIdQuery, function (err, rows, fields) {
        if (err) throw err

        let vehicleTypeQuery = `UPDATE VEHICLE_TYPE
            SET BRAND = ${addQuotes(car.brand)}, MODEL = ${addQuotes(car.model)}
            WHERE VEHICLE_TYPE_ID = ${rows[0]["VEHICLE_TYPE_ID"]};`

        connection.query(vehicleTypeQuery, function (err, rows, fields) {
            if (err) throw err
            res.json("success");
            connection.end();
        })
    })
})

app.delete('/cars/:vin', (req, res) => {
    let vin = req.params.vin

    let inventoryQuery = `DELETE FROM INVENTORY
        WHERE VIN = ${addQuotes(vin)};`

    connection.query(inventoryQuery, function (err, rows, fields) {
        if (err) throw err

        let getVehicleTypeIdQuery = `SELECT VEHICLE_TYPE_ID
            FROM VEHICLE
            WHERE VIN = ${addQuotes(vin)};`

        connection.query(getVehicleTypeIdQuery, function (err, vehicleTypeIdRows, fields) {
            if (err) throw err

            let vehicleQuery = `DELETE FROM VEHICLE
                WHERE VIN = ${addQuotes(vin)};`

            connection.query(vehicleQuery, function (err, rows, fields) {
                if (err) throw err

                let vehicleTypeQuery = `DELETE FROM VEHICLE_TYPE
                    WHERE VEHICLE_TYPE_ID = ${vehicleTypeIdRows[0]["VEHICLE_TYPE_ID"]};`

                connection.query(vehicleTypeQuery, function (err, rows, fields) {
                    if (err) throw err
                    res.json("success");
                    connection.end();
                })
            })
        })
    })
})

app.get('/cars/:vin/image', (req, res) => {
    let vin = req.params.vin

    let query = `SELECT IMAGE
        FROM VEHICLE
        WHERE VIN = ${vin};`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.json({image: rows[0]["IMAGE"]});
        connection.end();
    })
})

app.post('/cars/:vin/image', (req, res) => {
    let vin = req.params.vin
    let image = req.body.image

    let query = `UPDATE VEHICLE
        SET IMAGE = ${addQuotes(image)}
        WHERE VIN = ${addQuotes(vin)};`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.json("success");
        connection.end();
    })
})

function addQuotes(value) {
    return (typeof value == "string") && (value != null) ? `'${value}'` : value;
}

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})