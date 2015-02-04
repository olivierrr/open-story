var fs = require('fs')
var http = require('http')
var concat = require('concat-stream')
var Router = require('unpm-router')
var formBody = require('body/form')
var uuid = require('node-uuid')
var serverUrl = require('server-url')

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
var db = require('./lib/db')
var video = require('./lib/video')

var router = Router()
var server = http.createServer(handle)

db.connect(config.mongo, function() {
  console.log('Connected to DB.')
  server.listen(+config.port, function() {
    console.log('Server live at:', serverUrl(server))
  })
})

/**
 * Upsert events to DB.
 * Generate session uuid if missing.
 */
router.add('post', '/update', function(req, res) {
  formBody(req, {}, function(err, data) {
    // console.log(data)

    if(!data.session) {
      data.session = uuid.v4()
    }

    if(data.json) {
      try {
        db.save(data.session, JSON.parse(data.json))
      } catch(e) {
        console.error('Bad json:', e)
      }
    }

    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(data.session)
  })
})

/**
 * Main http handler.
 */
function handle(req, res) {
  var match = router.match(req)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  if(match) {
    match.fn(req, res, match)
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end('404 - Not found')
  }
}
