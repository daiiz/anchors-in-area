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

  var find = function find(parent, element) {
    var tagName = element.tagName.toLowerCase();
    var elements = parent.querySelectorAll(tagName);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var elem = _step.value;

        if (elem === element) return true;
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

    return false;
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
    var _anchor$position$page = anchor.position.page,
        left = _anchor$position$page.left,
        top = _anchor$position$page.top,
        right = _anchor$position$page.right,
        bottom = _anchor$position$page.bottom;

    var points = [[left + 1, top + 1], [right - 1, top + 1], [right - 1, bottom - 1], [left + 1, bottom - 1]];
    var pageXOffset = 0;
    var pageYOffset = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var point = _step2.value;

        var element = document.elementFromPoint(point[0] - pageXOffset, point[1] - pageYOffset);
        if (element === anchorNode || find(element, anchorNode) || find(anchorNode, element)) return true;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return false;
  };

  var candidateAnchorNodes = document.querySelectorAll('a');
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = candidateAnchorNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var anchorNode = _step3.value;

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
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return anchors;
}