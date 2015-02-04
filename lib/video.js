var phantom = require('phantom')

module.exports = video

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
      p.exit()
    }
  }

  function processEvent() {
    if(e.type === 'click') {

    }

    if (e.type === 'keypress') {
      p.evaluate(function() {
        document.querySelector(e.data.target).value += e.data.keyCode
      })
    }

    if(e.type === 'resize') {
      p.set('viewportSize', {
        width: e.data.innerWidth,
        height: e.data.innerHeight
      })
    }

    p.render('pics/arg' + i + '.png')
  }
}
