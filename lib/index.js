'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnchorsInArea = function () {
  function AnchorsInArea() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.document;

    _classCallCheck(this, AnchorsInArea);

    this.root = node;
    this.options = {
      detail: false,
      excludeInvisibles: true,
      onlyInTopLayer: true,
      onlyHttpUrl: true
    };
    this.initialize();
  }

  _createClass(AnchorsInArea, [{
    key: 'initialize',
    value: function initialize() {
      this.range = {};
      this.anchors = [];
    }
  }, {
    key: '_isInvolvedIn',
    value: function _isInvolvedIn(_ref) {
      var page = _ref.page;
      var left = page.left,
          top = page.top,
          right = page.right,
          bottom = page.bottom;

      var range = this.range;
      if (!left || !top || !right || !bottom) return false;
      var X = range.page.left;
      var Y = range.page.top;
      var Xw = range.page.right || range.page.left + range.width;
      var Yh = range.page.bottom || range.page.top + range.height;
      if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true;
      return false;
    }
  }, {
    key: '_isTheTopLayer',
    value: function _isTheTopLayer(anchor, anchorNode) {
      var _anchor$position$page = anchor.position.page,
          left = _anchor$position$page.left,
          top = _anchor$position$page.top,
          right = _anchor$position$page.right,
          bottom = _anchor$position$page.bottom;

      var points = [[left + 1, top + 1], [right - 1, top + 1], [right - 1, bottom - 1], [left + 1, bottom - 1]];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          var element = document.elementFromPoint(point[0] - window.pageXOffset, point[1] - window.pageYOffset);
          if (element === anchorNode || (0, _jquery2.default)(element).find(anchorNode).length > 0 || (0, _jquery2.default)(anchorNode).find(element).length > 0) return true;
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
    }
  }, {
    key: 'getStandardRange',
    value: function getStandardRange(_ref2) {
      var top = _ref2.top,
          left = _ref2.left,
          bottom = _ref2.bottom,
          right = _ref2.right,
          page = _ref2.page,
          width = _ref2.width,
          height = _ref2.height;

      var _page = {};
      _page.top = top === undefined ? page.top : top + window.scrollY;
      _page.left = left === undefined ? page.left : left + window.scrollX;
      _page.bottom = bottom === undefined ? page.bottom : bottom + window.scrollY;
      _page.right = right === undefined ? page.right : right + window.scrollX;

      if (height) {
        _page.bottom = _page.top + height;
      } else {
        height = _page.bottom - _page.top;
      }

      if (width) {
        _page.right = _page.left + width;
      } else {
        width = _page.right - _page.left;
      }
      return { page: _page, width: width, height: height };
    }
  }, {
    key: 'findRelative',
    value: function findRelative(range) {
      var anchors = this.find(range);

      var _getStandardRange = this.getStandardRange(range),
          page = _getStandardRange.page,
          width = _getStandardRange.width,
          height = _getStandardRange.height;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = anchors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var anchor = _step2.value;

          anchor.position = {
            page: {
              left: +(100 * (anchor.position.page.left - page.left) / width).toFixed(2),
              top: +(100 * (anchor.position.page.top - page.top) / height).toFixed(2)
            },
            width: +(100 * anchor.position.width / width).toFixed(2),
            height: +(100 * anchor.position.height / height).toFixed(2)
          };
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

      return anchors;
    }
  }, {
    key: 'find',
    value: function find(range) {
      var _getStandardRange2 = this.getStandardRange(range),
          page = _getStandardRange2.page,
          width = _getStandardRange2.width,
          height = _getStandardRange2.height;

      if (page.left === undefined || page.top === undefined || page.right === undefined || page.bottom === undefined) return [];
      this.initialize();
      this.range = { page: page };

      var candidateAnchorNodes = document.querySelectorAll('a');

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = candidateAnchorNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var anchorNode = _step3.value;

          var href = anchorNode.href;
          if (this.options.onlyHttpUrl && !href.startsWith('http')) continue;
          var rect = anchorNode.getBoundingClientRect();
          if (this.options.excludeInvisibles && rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
            continue;
          }
          var anchor = {
            text: anchorNode.innerText.trim(),
            url: anchorNode.href || '',
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
          };
          if (this.options.detail) {
            anchor.ref = anchorNode;
          }

          if (!this._isInvolvedIn(anchor.position)) continue;
          if (this.options.onlyInTopLayer && !this._isTheTopLayer(anchor, anchorNode)) continue;
          this.anchors.push(anchor);
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

      return this.anchors;
    }
  }]);

  return AnchorsInArea;
}();

exports.default = AnchorsInArea;