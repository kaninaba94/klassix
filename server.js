if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const cors = require('cors')
const bcrypt = require('bcrypt')
const fs = require('fs')

const app = express()
app.use(express.static(__dirname))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    accept: 'application/json'
}))

app.get('/', (req, res) => {
    var composerIds = JSON.parse(fs.readFileSync('C:\\Users\\knaraghi\\pycharm\\klassix\\data\\artist_ids.json'))
    res.render('index.ejs', {composerIds: composerIds})
})

app.get('/work_composer=:id', async (req, res) => {
    res.render('index.ejs')
})

// app.post('/save', async (req, res) => {
//     await fs.writeFile('C:\\Users\\knaraghi\\pycharm\\klassix\\data\\artist_works', req.body)
// })

app.get('/test', (req, res) => {
    res.render('test.ejs')
})

const port = 3000
app.listen(port, async () => {
    console.log(`App is listening on port ${port}!`)
})
