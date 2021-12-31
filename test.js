const fs = require('fs')
var path = 'C:\\Users\\knaraghi\\pycharm\\klassix\\data\\artist_ids.json'

var json = JSON.parse(fs.readFileSync(path))
for (const [composer, id] of Object.entries(json)) {
    console.log(composer)
}