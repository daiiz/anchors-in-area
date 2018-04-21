export function getAnchors (rangeStr) {
  const range = JSON.parse(rangeStr)
  const anchors = []
  const options = {
    onlyHttpUrl: true,
    excludeInvisibles: true,
    onlyInTopLayer: true
  }

  const isInvolvedIn = ({ page, range })=> {
    const { left, top, right, bottom } = page
    if (!left || !top || !right || !bottom) return false
    const X = range.page.left
    const Y = range.page.top
    const Xw = range.page.right || (range.page.left + range.width)
    const Yh = range.page.bottom || (range.page.top + range.height)
    if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true
    return false
  }

  const isTheTopLayer = (anchor, anchorNode) => {
    return true
  }

  const candidateAnchorNodes = document.querySelectorAll('a')
  for (const anchorNode of candidateAnchorNodes) {
    const href = anchorNode.href
    if (options.onlyHttpUrl && !href.startsWith('http')) continue
    const rect = anchorNode.getBoundingClientRect()
    if (options.excludeInvisibles &&
      rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
      continue
    }
    const anchor = {
      text: anchorNode.innerText.trim(),
      url: anchorNode.href || '',
      position: {
        left: rect.left - range.scroll.x,
        top: rect.top - range.scroll.y,
        right: rect.right - range.scroll.x,
        bottom: rect.bottom - range.scroll.y,
        page: {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        },
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      }
    }
    if (!isInvolvedIn({ page: anchor.position.page, range })) continue
    if (options.onlyInTopLayer && !isTheTopLayer(anchor, anchorNode)) continue
    anchors.push(anchor)
  }

  return anchors
}
