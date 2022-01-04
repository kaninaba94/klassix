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
const passport = require('passport')
const methodOverride = require('method-override')

const app = express()
app.use(express.static(__dirname))
// app.use(express.static('public'))
app.use(passport.initialize())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser())
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(passport.session())
const initializePassport = require('./passportConfig')
const database = require('./database')
const User = database.User
initializePassport(
    passport,
    async (email) => {
        return (await User.findOne({email: email}))
    },
    async (id) => {
        return (await User.findOne({id: id}))
    }
)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
// }))
app.set('layout', 'layouts/layout')
app.use(expressEjsLayouts)
app.use(flash())
app.use(methodOverride('_method'))
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

const Composer = database.Composer
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true
}

app.get('/', async (req, res) => {
    const composers = await Composer.find()
    res.render('home.ejs', {composers: composers, authenticated: req.isAuthenticated()})
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

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
}))

app.get('/register', async (req, res) => {
    res.render('register')
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.post('/register', async (req, res) => {
    console.log(req.body.password)
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        if (await User.findOne({name: req.body.name})) {
            res.render('register', {errorMessage: 'This user name is already registered'})
            return
        }
        if (await User.findOne({email: req.body.email})) {
            res.render('register', {errorMessage: 'This email is already registered'})
            return
        }
        const newUser = new User({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/register')
    }
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const port = 3000
app.listen((process.env.PORT || port), async () => {
    console.log(`App is listening on port ${port}!`)
})

// TODO: Set up a large enough database of works locally to meaningfully simulate the eventual running website.
// TODO: How do I exclude gitignore files in 'git add' ?
// TODO: Organise routing according to https://www.youtube.com/watch?v=qj2oDkvc4dQ&t=1105s