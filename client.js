var reqwest = require('reqwest')
var selectorQuery = require('selector-query')

var events = []
var startDate = Date.now()
var session = sessionStorage.getItem('open-story')

events.push({
  type: 'start',
  time: startDate
})

resize()

document.addEventListener('keypress', push('keypress', key))
document.addEventListener('click', push('click', click))
window.addEventListener('resize', push('resize', resize))
window.addEventListener('beforeunload', emit)

function push(eventType, fn) {
  return function(e) {
    events.push({
      type: eventType,
      time: Date.now() - startDate,
      data: fn(e)
    })

    if(events.length > 10) {
      emit()
    }
  }
}

function click(e) {
  paint(e.clientX, e.clientY)
  return {
    target: selectorQuery(e.target),
    x: e.clientX,
    y: e.clientY,
    which: e.which
  }
}

function key(e) {
  return {
    keyCode: e.keyCode
  }
}

function resize(e) {
  return {
    innerWidth: innerWidth,
    innerHeight: innerHeight
  }
}

// Spawn blue square on x/y -- for debugging.
function paint(x, y) {
  var elem = document.createElement('span')
  elem.style.width = '10px';
  elem.style.height = '10px';
  elem.style.position = 'absolute';
  elem.style.top = y - 5 + 'px'
  elem.style.left = x - 5 + 'px'
  elem.style.background = 'blue'
  elem.style.pointerEvents = 'none'
  document.body.appendChild(elem)
}

function emit() {
  console.log('emits')

  var _events = events.slice()
  events = []

  reqwest({
    url: 'http://localhost:3001/update',
    crossOrigin: true,
    method: 'post',
    data: {
      json: JSON.stringify(_events),
      session: session
    },
    success: function(res) {
      if(res) {
        sessionStorage.setItem('open-story', res)
        session = res
      }
    }
  })
}