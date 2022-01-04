if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  //  alternatively require('dotenv').load() or require('dotenv').parse()
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
// const cors = require('cors')
const bcrypt = require('bcrypt')
const fs = require('fs')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const https = require('https')
const axios = require('axios')
const expressEjsLayouts = require('express-ejs-layouts')

const app = express()
app.use(express.static(__dirname))
// app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
// }))
app.set('layout', 'layouts/layout')
app.use(expressEjsLayouts)
// TODO: How do I get the works comprised in a catalogue from the musicbrianz API?
// TODO: Migrate the local DB to MongoDB Atlas.

// const indexRouter = require('./routes/index')
// app.use('/', indexRouter)

async function connect2Mongoose() {
    await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
}

connect2Mongoose()

const Composer = require('./database')
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true
}

app.get('/', async (req, res) => {
    // // commented out to get heroku app running (it can't read files using fs)
    // var composerIds = JSON.parse(fs.readFileSync('C:\\Users\\knaraghi\\pycharm\\klassix\\data\\artist_ids.json'))
    const composers = await Composer.find()
    res.render('index.ejs', {composers: composers})
})

app.get('/work_composer=:id', async (req, res) => {
    let maxLimit = 100  // maximal limit for musicbrainz work browsing queries is 100
    let offset = 0
    let query = `https://www.musicbrainz.org/ws/2/work?artist=${req.params.id}&fmt=json&offset=${offset}&limit=${maxLimit}`
    let musicbrainzRes = await axios.get(query)
    let works = musicbrainzRes.data.works
    const workCount = musicbrainzRes.data['work-count']
    while (offset <= workCount) {
        await sleep(1150)
        offset += maxLimit
        query = `https://www.musicbrainz.org/ws/2/work?artist=${req.params.id}&fmt=json&offset=${offset}&limit=${maxLimit}`
        musicbrainzRes = await axios.get(query)
        works = works.concat(musicbrainzRes.data.works)
    }
    res.render('composerWorks.ejs', {works: works})
})

app.get('/test', (req, res) => {
    res.render('test.ejs')
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const port = 3000
app.listen(process.env.PORT || port, async () => {
    console.log(`App is listening on port ${port}!`)
})

//TODO: Set up a large enough database of works locally to meaningfully simulate the eventual running website.
// TODO: How do I exclude gitignore files in 'git add' ?