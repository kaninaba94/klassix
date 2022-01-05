if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  //  alternatively require('dotenv').load() or require('dotenv').parse()
}

const fs = require('fs')
const mongoose = require('mongoose')

// Schemata
const composerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
})
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
const ooEssentialComposerSchema = new mongoose.Schema({
    id: String,
    name: String,
    complete_name: String,
    birth: String,
    death: String,
    epoch: String,
    portrait: String
})


// Models
const Composer = mongoose.model('Composer', composerSchema)
const User = mongoose.model('User', userSchema)
const OoEssentialComposer = mongoose.model('OoEssentialComposer', ooEssentialComposerSchema)

async function asyncPopulateWorksFromMusicbrainz() {
    // functions and modules
    const axios = require('axios')
    const serverModule = require('./server')
    const sleep = serverModule.sleep
    const getAllWorksByComposerId = serverModule.getAllWorksByComposerId
    // mongoose
    await mongoose.connect(
        'mongodb+srv://kaninaba94:E3rZFsT8uh65UcD@kaspasklasta.aikgg.mongodb.net/klassix?retryWrites=true',
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
    // get all composer name-id pairs
    const composerData = await Composer.find()
    for (composer of composerData) {
        console.log(composer)
        // let works = await getAllWorksByComposerId(composer.id)
        // console.log(works)
        // await composer.set('works', works)
        await composer.save()
    }
    mongoose.connection.close().then(console.log('Mongoose connection closed'))
}

async function asyncCreateCollectionFromOpenOpusEssentialComposers() {
    const axios = require('axios')
    const query = 'https://api.openopus.org/composer/list/rec.json'
    const response = await axios.get(query)
    const essentialComposers = await response.data.composers
    console.log(essentialComposers)
    for (eC of essentialComposers) {
        // let essCom = new OoEssentialComposer(eC)
        // await essCom.save()

    }
}

if (require.main === module) {
    // asyncPopulateWorksFromMusicbrainz()
    asyncCreateCollectionFromOpenOpusEssentialComposers()
}

exports.Composer = Composer
exports.User = User