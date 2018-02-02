import $ from 'jquery'

export default class AnchorsInArea {
  constructor (node=window.document) {
    this.root = node
    this.options = {
      detail: false,
      excludeInvisibles: true,
      onlyInTopLayer: true,
      onlyHttpUrl: true
    }
    this.initialize()
  }

  initialize () {
    this.range = {}
    this.anchors = []
  }

  _isInvolvedIn ({ pageLeft, pageTop, pageRight, pageBottom }) {
    if (!pageLeft || !pageTop || !pageRight || !pageBottom) return false
    var X = this.range.pageLeft
    var Y = this.range.pageTop
    var Xw = this.range.pageRight || this.range.pageLeft + this.range.width
    var Yh = this.range.pageBottom || this.range.pageTop + this.range.height
    if (X <= pageLeft && pageRight <= Xw && Y <= pageTop && pageBottom <= Yh) return true
    return false
  }

  _isTheTopLayer (anchor, anchorNode) {
    const points = [
      [anchor.position.pageLeft + 1, anchor.position.pageTop + 1],
      [anchor.position.pageRight - 1, anchor.position.pageTop + 1],
      [anchor.position.pageRight - 1, anchor.position.pageBottom - 1],
      [anchor.position.pageLeft + 1, anchor.position.pageBottom - 1]
    ]

    for (let point of points) {
      const element = document.elementFromPoint(
        point[0] - window.pageXOffset, point[1] - window.pageYOffset)
      if (element === anchorNode || $(element).find(anchorNode).length > 0 ||
        $(anchorNode).find(element).length > 0) return true
    }
    return false
  }

  // pageTop, pageLeft: scrollX, scrollYが加算された値
  getStandardRange ({ top, left, bottom, right,
    pageTop, pageLeft, pageBottom, pageRight, width, height }) {
    // scroll量も加味された、ページの左上を原点とした座標系に変換する
    pageTop = (top === undefined) ? pageTop : (top + window.scrollY)
    pageLeft = (left === undefined) ? pageLeft : (left + window.scrollX)
    pageBottom = (bottom === undefined) ? pageBottom : (bottom + window.scrollY)
    pageRight = (right === undefined) ? pageRight : (right + window.scrollX)

    if (height) {
      pageBottom = pageTop + height
    } else {
      height = pageBottom - pageTop
    }

    if (width) {
      pageRight = pageLeft + width
    } else {
      width = pageRight - pageLeft
    }

    return { pageLeft, pageTop, pageRight, pageBottom, width, height }
  }

  // width, heightに対する相対的な値(%)を返す
  findRelative (range) {
    const anchors = this.find(range)
    const {pageLeft, pageTop, width, height} = this.getStandardRange(range)
    for (const anchor of anchors) {
      anchor.position = {
        pageLeft: +(100 * (anchor.position.pageLeft - pageLeft) / width).toFixed(2),
        pageTop: +(100 * (anchor.position.pageTop - pageTop) / height).toFixed(2),
        width: +(100 * anchor.position.width / width).toFixed(2),
        height: +(100 * anchor.position.height / height).toFixed(2)
      }
    }
    return anchors
  }

  // ページの左上を原点として、scroll量も加味した値(px)を返す
  find (range) {
    const {pageLeft, pageTop, pageRight, pageBottom} = this.getStandardRange(range)

    if (pageLeft === undefined || pageTop === undefined
      || pageRight === undefined || pageBottom === undefined) return []
    this.initialize()
    this.range = { pageLeft, pageTop, pageRight, pageBottom }

    // XXX: 候補をもう少し小さくできないか
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
          pageLeft: rect.left + window.scrollX,
          pageTop: rect.top + window.scrollY,
          pageRight: rect.right + window.scrollX,
          pageBottom: rect.bottom + window.scrollY,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        }
      }
      if (this.options.detail) {
        anchor.ref = anchorNode
      }

      if (!this._isInvolvedIn(anchor.position)) continue
      if (this.options.onlyInTopLayer && !this._isTheTopLayer(anchor, anchorNode)) continue
      this.anchors.push(anchor)
    }

    return this.anchors
  }
}
