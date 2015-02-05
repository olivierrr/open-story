
var video = require('../lib/video')
var data = [{"type":"start","time":1423096885036},{"type":"click","time":1164,"data":{"target":"html","x":173,"y":312,"which":1}},{"type":"click","time":1427,"data":{"target":"html","x":430,"y":156,"which":1}},{"type":"click","time":1988,"data":{"target":"body input:nth-child(1) ","x":98,"y":17,"which":1}},{"type":"keypress","time":2308,"data":{"keyCode":97,"target":"body input:nth-child(1) "}},{"type":"keypress","time":2386,"data":{"keyCode":119,"target":"body input:nth-child(1) "}},{"type":"keypress","time":2474,"data":{"keyCode":100,"target":"body input:nth-child(1) "}},{"type":"click","time":2891,"data":{"target":"html","x":75,"y":118,"which":1}},{"type":"click","time":3315,"data":{"target":"body input:nth-child(1) ","x":40,"y":12,"which":1}},{"type":"keypress","time":3546,"data":{"keyCode":97,"target":"body input:nth-child(1) "}},{"type":"keypress","time":3554,"data":{"keyCode":113,"target":"body input:nth-child(1) "}}]

video('http://localhost:8080', data, function() {
  console.log('done')
})
