if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  //  alternatively require('dotenv').load() or require('dotenv').parse()
}

const fs = require('fs')
const mongoose = require('mongoose')

async function connect() {
    await mongoose.connect(
        'mongodb+srv://kaninaba94:E3rZFsT8uh65UcD@kaspasklasta.aikgg.mongodb.net/klassix?retryWrites=true',
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
}
async function close() {
    mongoose.connection.close().then(console.log('Mongoose connection closed'))
}

// Schemata
const workListSchema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    name: {type: String, required: true},
    works: {type: [mongoose.Types.ObjectId], required: true}
})
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
    },
    friends: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    liked: {
        type: [
            {
                work: mongoose.Types.ObjectId,
                likeDate: Date
            }
        ],
        required: false
    },
    listened: {
        type: [
            {
                work: mongoose.Types.ObjectId,
                like: Boolean,
                notes: String
            }
        ],
        required: false
    },
    listenTo: {
        type: [
            {
                work: mongoose.Schema.ObjectId,
            }
        ],
        required: false
    },
    customWorkLists: {
        type: [workListSchema],
        required: false
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
const ooDumpComposerSchema = new mongoose.Schema({
    number: Number,
    name: String,
    complete_name: String,
    epoch: String,
    birth: String,
    deat: String,
    popular: String,
    recommended: String,
    works: [
        {
            title: String,
            subtitle: String,
            searchterms: String,
            popular: String,
            recommended: String,
            genre: String
        }
    ]
})
const ooComposerByIdSchema = new mongoose.Schema({
    id: Number,
    name: String,
    complete_name: String,
    birth: String,
    death: String,
    epoch: String,
    portrait: String
})
const workSchema = new mongoose.Schema({
    composer: mongoose.Types.ObjectId,
    title: String,
    subtitle: String,
    genre: String,
    likedBy: [mongoose.Types.ObjectId],
    listenToListedBy: [mongoose.Types.ObjectId],
    listenedListedBy: [mongoose.Types.ObjectId],
})

// Models
const WorkList = mongoose.model('List', workListSchema)
const Composer = mongoose.model('Composer', composerSchema)
const User = mongoose.model('User', userSchema)
const OoEssentialComposer = mongoose.model('OoEssentialComposer', ooEssentialComposerSchema)
const OoDumpComposer = mongoose.model('OoDumpComposer', ooDumpComposerSchema)
const OoComposerById = new mongoose.model('OoComposerById', ooComposerByIdSchema)
const Work = new mongoose.model('Work', workSchema)

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
async function asyncCreateCollectionFromOpenOpusDumpComposers() {
    await mongoose.connect(
        'mongodb+srv://kaninaba94:E3rZFsT8uh65UcD@kaspasklasta.aikgg.mongodb.net/klassix?retryWrites=true',
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
    let composers = await OoDumpComposer.find()
    for (c of composers) {
        for (w of c.works) {
            let wTmp = new Work(w)
            await wTmp.save()
        }
    }
    mongoose.connection.close().then(console.log('Mongoose connection closed'))
}
async function asyncAdaptUserSchema() {
    await mongoose.connect(
        'mongodb+srv://kaninaba94:E3rZFsT8uh65UcD@kaspasklasta.aikgg.mongodb.net/klassix?retryWrites=true',
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
    const users = await User.find()
    for (let user of users) {
        user.set('friends', [])
        user.set('liked', [])
        user.set('listened', [])
        user.set('listenTo', [])
        user.set('customLists', 'undefined', {strict: false})
        user.set('customWorkLists', [])
        await user.save()
    }
    mongoose.connection.close().then(console.log('Mongoose connection closed'))
}
async function asyncCompareNumWorksDumpListbyid() {
    await connect()
    let dumpWorks = []
    let dumpComposers = await OoDumpComposer.find()
    for (let dumpC of dumpComposers) {
        for (let dumpW of dumpC.works) {
            dumpWorks.push(dumpW)
        }
    }
    const axios = require('axios')
    let response = await axios.get('http://api.openopus.org/work/list/ids/0.json')
    let idWorks = response.data.works

    console.log('idWorks: ' + idWorks.length)
    console.log('dumpWorks: ' + dumpWorks.slice(0,5))
    await close()

}
async function asyncCreateWorks() {
    await connect()
    const dumpComps = await OoDumpComposer.find()
    for (let com of dumpComps) {
        for (let work of com.works) {
            let w = new Work({
                composer: com._id,
                title: work.title,
                subtitle: work.subtitle,
                genre: work.genre,
                likedBy: [],
                listenToListedBy: [],
                ListenedListedBy: []
            })
            await w.save()
        }
    }
    await close()
}

if (require.main === module) {
    // asyncPopulateWorksFromMusicbrainz()
    // asyncCreateCollectionFromOpenOpusDumpComposers()
    // asyncAdaptUserSchema()
    // asyncCompareNumWorksDumpListbyid()
    asyncCreateWorks()
}

exports.Composer = Composer
exports.User = User
exports.OoEssentialComposer = OoEssentialComposer
exports.OoDumpComposer = OoDumpComposer
exports.OoComposerById = OoComposerById