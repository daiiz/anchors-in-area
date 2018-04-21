'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnchors = getAnchors;
function getAnchors(rangeStr) {
  var range = JSON.parse(rangeStr);
  var anchors = [];
  var options = {
    onlyHttpUrl: true,
    excludeInvisibles: true,
    onlyInTopLayer: true
  };

  var isInvolvedIn = function isInvolvedIn(_ref) {
    var page = _ref.page,
        range = _ref.range;
    var left = page.left,
        top = page.top,
        right = page.right,
        bottom = page.bottom;

    if (!left || !top || !right || !bottom) return false;
    var X = range.page.left;
    var Y = range.page.top;
    var Xw = range.page.right || range.page.left + range.width;
    var Yh = range.page.bottom || range.page.top + range.height;
    if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true;
    return false;
  };

  var isTheTopLayer = function isTheTopLayer(anchor, anchorNode) {
    return true;
  };

  var candidateAnchorNodes = document.querySelectorAll('a');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = candidateAnchorNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var anchorNode = _step.value;

      var href = anchorNode.href;
      if (options.onlyHttpUrl && !href.startsWith('http')) continue;
      var rect = anchorNode.getBoundingClientRect();
      if (options.excludeInvisibles && rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
        continue;
      }
      var anchor = {
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
            bottom: rect.bottom
          },
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        }
      };
      if (!isInvolvedIn({ page: anchor.position.page, range: range })) continue;
      if (options.onlyInTopLayer && !isTheTopLayer(anchor, anchorNode)) continue;
      anchors.push(anchor);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return anchors;
}