var phantom = require('phantom')

module.exports = video

/**
 * Create Phantom context.
 */
function video(url, events, cb) {
  phantom.create(function(ok) {
    ok.createPage(function(p) {
      p.open(url, function (status) {
        if(status === 'success') {
          frames(p, events, cb, ok)
        } else {
          console.error('PhantomJS Couldn\'nt open page')
          return p.exit()
        }
      })
    })
  })
}

/**
 * Take screenshots of phantom on every event.
 * This should be set @ a fixed framerate for smooth videos.
 */
function frames(p, events, cb, ok) {
  var i = 0
  var e

  iter()

  function iter() {
    e = events[++i] // skiping 0 on purpose

    if(e) {
      processEvent()
      setTimeout(iter, e.time)
    } else {
      cb()
      ok.exit()
    }
  }

  function processEvent() {
    if(e.type === 'click') {
      p.evaluate(function(target) {
        var elem = document.querySelector(target)
        if(!elem) {
          return 'invalid selector'
        }
        if(elem.click) {
          elem.click()
        }
      }, log, e.data.target)
    }

    if(e.type === 'keypress') {
      p.evaluate(function(target, keyCode) {
        var elem = document.querySelector(target)
        if(!elem) {
          return 'invalid selector'
        }
        if(typeof elem.value === 'string') {
          elem.value += String.fromCharCode(keyCode)
        }
      }, log, e.data.target, e.data.keyCode)
    }

    if(e.type === 'resize') {
      p.set('viewportSize', {
        width: e.data.innerWidth,
        height: e.data.innerHeight
      })
    }

    console.log('frame #', i, 'rendered')
    p.render('pics/arg' + i + '.png')
  }
}

function log(o) {
  if(o) console.log(o)
}