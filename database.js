if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()  //  alternatively require('dotenv').load() or require('dotenv').parse()
}

const fs = require('fs')
const mongoose = require('mongoose')

const composerSchema = mongoose.Schema(
    {
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
    }
)

const Composer = mongoose.model('Composer', composerSchema)

async function asyncFunction() {
    await mongoose.connect('mongodb+srv://kaninaba94:E3rZFsT8uh65UcD@kaspasklasta.aikgg.mongodb.net/myFirstDatabase?retryWrites=true', {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to Mongoose'))
    const composerData = JSON.parse(fs.readFileSync('C:\\Users\\knaraghi\\pycharm\\klassix\\data\\artist_ids.json'))
    for (let [name, id] of Object.entries(composerData)) {
        let composer = new Composer({name: name, id: id})
        await composer.save()
    }
    mongoose.connection.close().then(console.log('Mongoose connection closed'))
}

if (require.main === module) {
    asyncFunction()
}

module.exports = Composer