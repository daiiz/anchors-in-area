window.AnchorsInArea = require('../')
const $ = require('jquery')

window.aia = new AnchorsInArea(document)
const $wrapper = $('#wrapper')
$wrapper.on('click', () => {
  $wrapper.hide()
})

class SampleDebugger {
  constructor (node = window.document) {
    this.root = node
    this.range = {}
  }

  setRange ({ top, left, bottom, right, width, height }) {
    $wrapper.css({
      top, left,
      width: width || (right - left),
      height: height || (bottom - top)
    })
    this.range = { top, left, bottom, right, width, height }
    $wrapper.show()
  }

  find () {
    $wrapper.hide()
    const a = new AnchorsInArea(this.root)
    const res = a.find(this.range)
    $wrapper.show()
    return res
  }
}

window.debug = new SampleDebugger()
