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

  _isInvolvedIn ({ page }) {
    const { left, top, right, bottom } = page
    const range = this.range
    if (!left || !top || !right || !bottom) return false
    const X = range.page.left
    const Y = range.page.top
    const Xw = range.page.right || (range.page.left + range.width)
    const Yh = range.page.bottom || (range.page.top + range.height)
    if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true
    return false
  }

  _isTheTopLayer (anchor, anchorNode) {
    const { left, top, right, bottom } = anchor.position.page
    const points = [
      [left + 1, top + 1],
      [right - 1, top + 1],
      [right - 1, bottom - 1],
      [left + 1, bottom - 1]
    ]

    for (let point of points) {
      const element = document.elementFromPoint(
        point[0] - window.pageXOffset, point[1] - window.pageYOffset)
      if (element === anchorNode || $(element).find(anchorNode).length > 0 ||
        $(anchorNode).find(element).length > 0) return true
    }
    return false
  }

  // page: scrollX, scrollYが加算された値
  getStandardRange ({ top, left, bottom, right, page, width, height }) {
    // scroll量も加味された、ページの左上を原点とした座標系に変換する
    const _page = {}
    _page.top = (top === undefined) ? page.top : (top + window.scrollY)
    _page.left = (left === undefined) ? page.left : (left + window.scrollX)
    _page.bottom = (bottom === undefined) ? page.bottom : (bottom + window.scrollY)
    _page.right = (right === undefined) ? page.right : (right + window.scrollX)

    if (height) {
      _page.bottom = _page.top + height
    } else {
      height = _page.bottom - _page.top
    }

    if (width) {
      _page.right = _page.left + width
    } else {
      width = _page.right - _page.left
    }
    return { page: _page, width, height }
  }

  // width, heightに対する相対的な値(%)を返す
  findRelative (range, tagName='a') {
    const anchors = this.find(range, tagName)
    const { page, width, height } = this.getStandardRange(range)
    for (const anchor of anchors) {
      anchor.position = {
        page: {
          left: +(100 * (anchor.position.page.left - page.left) / width).toFixed(2),
          top: +(100 * (anchor.position.page.top - page.top) / height).toFixed(2)
        },
        width: +(100 * anchor.position.width / width).toFixed(2),
        height: +(100 * anchor.position.height / height).toFixed(2)
      }
    }
    return anchors
  }

  // ページの左上を原点として、scroll量も加味した値(px)を返す
  find (range, tagName='a') {
    const { page, width, height } = this.getStandardRange(range)

    if (page.left === undefined || page.top === undefined
      || page.right === undefined || page.bottom === undefined) return []
    this.initialize()
    this.range = { page }

    // XXX: 候補をもう少し小さくできないか
    const candidateAnchorNodes = document.querySelectorAll(tagName)

    for (let anchorNode of candidateAnchorNodes) {
      const link = anchorNode.href || anchorNode.src
      if (link && this.options.onlyHttpUrl && !link.startsWith('http')) continue
      const rect = anchorNode.getBoundingClientRect()
      if (this.options.excludeInvisibles &&
        rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
        continue
      }
      const anchor = {
        text: anchorNode.innerText.trim(),
        url: link || '',
        position: {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          page: {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            right: rect.right + window.scrollX,
            bottom: rect.bottom + window.scrollY
          },
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
