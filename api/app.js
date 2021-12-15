const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var cors = require('cors')
app.use(cors())

var mysql = require('mysql')
var pool = mysql.createPool({
  host: 'inventory-management-db.c1o9xrhwtmlz.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'rootroot',
  database: 'INVENTORY_MANAGEMENT_DB'
})

app.get('/cars', (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err

        let query = `SELECT VEHICLE.VIN, COLOR, YEAR, MILEAGE, IMAGE, BRAND, MODEL, PRICE
        FROM VEHICLE
        LEFT OUTER JOIN VEHICLE_TYPE ON VEHICLE.VEHICLE_TYPE_ID = VEHICLE_TYPE.VEHICLE_TYPE_ID
        LEFT OUTER JOIN INVENTORY ON VEHICLE.VIN = INVENTORY.VIN;`

        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            formatInventoryData(rows)
            res.json({cars: rows})
            connection.release()
        })
    })
})

app.post('/cars', (req, res) => {
    let car = req.body.car

    pool.getConnection(function (err, connection) {
        if (err) throw err

        let vehicleTypeExistsQuery = `SELECT VEHICLE_TYPE_ID
            FROM VEHICLE_TYPE
            WHERE BRAND ${(car.brand == null) ? `IS NULL` : `= ${addQuotes(car.brand)}`}
                AND MODEL ${(car.model == null) ? `IS NULL` : `= ${addQuotes(car.model)}`};`
        
        connection.query(vehicleTypeExistsQuery, function (err, rows, fields) {
            if (rows.length > 0) {
                let vehicleQuery = `INSERT INTO VEHICLE (VIN, VEHICLE_TYPE_ID, COLOR, YEAR, MILEAGE)
                    VALUES (${addQuotes(car.vin)}, ${addQuotes(rows[0]["VEHICLE_TYPE_ID"])}, ${addQuotes(car.color)}, ${addQuotes(car.year)}, ${addQuotes(car.mileage)})`

                connection.query(vehicleQuery, function (err, rows, fields) {
                    if (err) throw err

                    let inventoryQuery = `INSERT INTO INVENTORY (VIN, PRICE)
                        VALUES (${addQuotes(car.vin)}, ${addQuotes(car.price)})`
            
                    connection.query(inventoryQuery, function (err, rows, fields) {
                        if (err) throw err
                        res.json("success")
                        connection.release()
                    })
                })
            } else {
                let vehicleTypeQuery = `INSERT INTO VEHICLE_TYPE (BRAND, MODEL)
                    VALUES (${addQuotes(car.brand)}, ${addQuotes(car.model)});`

                connection.query(vehicleTypeQuery, function (err, rows, fields) {
                    if (err) throw err
                    
                    let vehicleQuery = `INSERT INTO VEHICLE (VIN, VEHICLE_TYPE_ID, COLOR, YEAR, MILEAGE)
                        VALUES (${addQuotes(car.vin)}, ${addQuotes(rows.insertId)}, ${addQuotes(car.color)}, ${addQuotes(car.year)}, ${addQuotes(car.mileage)})`
        
                    connection.query(vehicleQuery, function (err, rows, fields) {
                        if (err) throw err
        
                        let inventoryQuery = `INSERT INTO INVENTORY (VIN, PRICE)
                            VALUES (${addQuotes(car.vin)}, ${addQuotes(car.price)})`
                
                        connection.query(inventoryQuery, function (err, rows, fields) {
                            if (err) throw err
                            res.json("success")
                            connection.release()
                        })
                    })
                })
            }
        })
    })
})

app.put('/cars/:vin', (req, res) => {
    let vin = req.params.vin
    let car = req.body.car

    pool.getConnection(function (err, connection) {
        if (err) throw err

        let inventoryQuery = `UPDATE INVENTORY
            SET PRICE = ${addQuotes(car.price)}
            WHERE VIN = ${addQuotes(vin)};`

        connection.query(inventoryQuery, function (err, rows, fields) {
            if (err) throw err
        })

        let vehicleTypeExistsQuery = `SELECT VEHICLE_TYPE_ID
            FROM VEHICLE_TYPE
            WHERE BRAND ${(car.brand == null) ? `IS NULL` : `= ${addQuotes(car.brand)}`}
                AND MODEL ${(car.model == null) ? `IS NULL` : `= ${addQuotes(car.model)}`};`

        connection.query(vehicleTypeExistsQuery, function (err, rows, fields) {
            if (rows.length > 0) { 
                let vehicleQuery = `UPDATE VEHICLE
                    SET VEHICLE_TYPE_ID = ${addQuotes(rows[0]["VEHICLE_TYPE_ID"])}, COLOR = ${addQuotes(car.color)}, YEAR = ${addQuotes(car.year)}, MILEAGE = ${addQuotes(car.mileage)}
                    WHERE VIN = ${addQuotes(vin)};`
    
                connection.query(vehicleQuery, function (err, rows, fields) {
                    if (err) throw err
                    res.json("success")
                    connection.release()
                })
            } else {
                let vehicleTypeQuery = `INSERT INTO VEHICLE_TYPE (BRAND, MODEL)
                    VALUES (${addQuotes(car.brand)}, ${addQuotes(car.model)});`

                connection.query(vehicleTypeQuery, function (err, rows, fields) {
                    if (err) throw err

                    let vehicleQuery = `UPDATE VEHICLE
                        SET VEHICLE_TYPE_ID = ${addQuotes(rows.insertId)}, COLOR = ${addQuotes(car.color)}, YEAR = ${addQuotes(car.year)}, MILEAGE = ${addQuotes(car.mileage)}
                        WHERE VIN = ${addQuotes(vin)};`
        
                    connection.query(vehicleQuery, function (err, rows, fields) {
                        if (err) throw err
                        res.json("success")
                        connection.release()
                    })
                })
            }
        })
    })
})

app.delete('/cars/:vin', (req, res) => {
    let vin = req.params.vin

    pool.getConnection(function (err, connection) {
        if (err) throw err

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

                    let vehicleTypeInUseQuery = `SELECT COUNT(*) AS COUNT
                        FROM VEHICLE
                        WHERE VEHICLE_TYPE_ID = ${addQuotes(vehicleTypeIdRows[0]["VEHICLE_TYPE_ID"])};`

                    connection.query(vehicleTypeInUseQuery, function (err, rows, fields) {
                        if (err) throw err

                        if (rows[0]["COUNT"] > 0) {
                            res.json("success")
                            connection.release()
                        } else {
                            let vehicleTypeQuery = `DELETE FROM VEHICLE_TYPE
                                WHERE VEHICLE_TYPE_ID = ${addQuotes(vehicleTypeIdRows[0]["VEHICLE_TYPE_ID"])};`
    
                            connection.query(vehicleTypeQuery, function (err, rows, fields) {
                                if (err) throw err
                                res.json("success")
                                connection.release()
                            })
                        }
                    })
                })
            })
        })
    })
})

app.post('/cars/:vin/image', (req, res) => {
    let vin = req.params.vin
    let image = req.body.image

    pool.getConnection(function (err, connection) {
        if (err) throw err

        let query = `UPDATE VEHICLE
            SET IMAGE = ${addQuotes(image)}
            WHERE VIN = ${addQuotes(vin)};`

        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.json("success")
            connection.release()
        })
    })
})

function addQuotes(value) {
    if (value == null || value == undefined) {
        return null;
    }
    return (typeof value == "string") ? `'${value}'` : value;
}

function formatInventoryData(data) {
    for (let i = 0; i < data.length; i++) { 
        for (let key in data[i]) {
            if(key.toLowerCase() !== key){
                data[i][key.toLowerCase()] = data[i][key];
                delete data[i][key];
            }
        }
    }
}

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})