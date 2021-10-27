const express = require('express')
const app = express()
const port = 3000

app.get('/cars', (req, res) => {
    
})

app.post('/cars', (req, res) => {
    
})

app.put('/cars/:vin', (req, res) => {
    
})

app.delete('/cars/:vin', (req, res) => {
    
})

app.get('/cars/:vin/image', (req, res) => {
    
})

app.post('/cars/:vin/image', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})