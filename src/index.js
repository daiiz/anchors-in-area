import $ from 'jquery'

export default class AnchorsInArea {
  constructor (node=window.document) {
    this.root = node
    this.options = {
      excludeInvisibles: true,
      onlyInTopLayer: true,
      onlyHttpUrl: true,
      maxDepth: 20
    }
    this.initialize()
  }

  initialize () {
    this.range = {}
    this.anchors = []
  }

  _isInvolvedIn ({ top, left, bottom, right }) {
    if (!top || !left || !bottom || !right) return false
    var X = this.range.left
    var Y = this.range.top
    var Xw = this.range.right || this.range.left + this.range.width
    var Yh = this.range.bottom || this.range.top + this.range.height
    if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true
    return false
  }

  _isTheTopLayer (anchor, anchorNode) {
    const points = [
      [anchor.position.left + 1, anchor.position.top + 1],
      [anchor.position.right - 1, anchor.position.top + 1],
      [anchor.position.right - 1, anchor.position.bottom - 1],
      [anchor.position.left + 1, anchor.position.bottom - 1]
    ]

    const childNodes = anchorNode.childNodes
    if (childNodes.length === 0) return false
    const childNode = childNodes[0]

    for (let point of points) {
      const element = document.elementFromPoint(
        point[0] - window.pageXOffset, point[1] - window.pageYOffset)
      if (element === childNode || $(element).find(childNode).length > 0 ||
        $(childNode).find(element).length > 0) return true
    }
    return false
  }

  find ({ top, left, bottom, right }) {
    if (!top || !left || !bottom || !right) return []
    this.initialize()
    this.range = { top, left, bottom, right }
    const candidateAnchorNodes = document.querySelectorAll('a')

    for (let anchorNode of candidateAnchorNodes) {
      const href = anchorNode.href
      if (this.options.onlyHttpUrl && !href.startsWith('http')) continue
      const rect = anchorNode.getBoundingClientRect()
      if (this.options.excludeInvisibles &&
        rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
        continue
      }
      const anchor = {
        text: anchorNode.innerText.trim(),
        url: anchorNode.href || '',
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          right: rect.right + window.scrollX
        }
      }

      if (!this._isInvolvedIn(anchor.position)) continue
      if (this.options.onlyInTopLayer && !this._isTheTopLayer(anchor, anchorNode)) continue
      this.anchors.push(anchor)
    }

    return this.anchors
  }
}
