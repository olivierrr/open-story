
var mongo = require('mongodb').MongoClient
var coll

module.exports = {
  connect: connect,
  save: noop
}

function connect(url, cb) {
  cb = cb || noop

  mongo.connect(url, function(err, db) {
    if(err) {
      throw err
    }

    coll = db.collection('sessions')
    cb(err)
  })
}

function save(_id, data) {
  coll.update(
    {_id: _id},
    {$push: {events: {$each: data}}}, //p.s. $setOnInsert
    {upsert: true},
    function(err){
      if(err) console.log(err)
      else console.log('data saved')
    }
  )
}

function noop() {}