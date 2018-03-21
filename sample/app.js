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

  setRange (range) {
    const a = new AnchorsInArea(this.root)
    const { page, width, height } = a.getStandardRange(range)
    $wrapper.css({
      left: page.left,
      top: page.top,
      width,
      height
    })
    this.range = { page, width, height }
    $wrapper.show()
  }

  find () {
    $wrapper.hide()
    const a = new AnchorsInArea(this.root)
    a.options.detail = true
    const res = a.find(this.range)
    $wrapper.show()
    return res
  }

  findRelative () {
    $wrapper.hide()
    const a = new AnchorsInArea(this.root)
    a.options.detail = true
    const res = a.findRelative(this.range)
    $wrapper.show()
    return res
  }
}

window.debug = new SampleDebugger()
