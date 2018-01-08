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
      excludeInvisibles: true,
      onlyInTopLayer: true,
      onlyHttpUrl: true,
      maxDepth: 20
    };
    this.initialize();
  }

  _createClass(AnchorsInArea, [{
    key: 'initialize',
    value: function initialize() {
      this.range = {};
      this.visited = [];
      this.candidateAnchorNodes = [];
      this.anchors = [];
    }
  }, {
    key: '_isInvolvedIn',
    value: function _isInvolvedIn(_ref) {
      var top = _ref.top,
          left = _ref.left,
          bottom = _ref.bottom,
          right = _ref.right;

      if (!top || !left || !bottom || !right) return false;
      var X = this.range.left;
      var Y = this.range.top;
      var Xw = this.range.right || this.range.left + this.range.width;
      var Yh = this.range.bottom || this.range.top + this.range.height;
      if (X <= left && right <= Xw && Y <= top && bottom <= Yh) return true;
      return false;
    }
  }, {
    key: '_isTheTopLayer',
    value: function _isTheTopLayer(anchor, anchorNode) {
      var points = [[anchor.position.left + 1, anchor.position.top + 1], [anchor.position.right - 1, anchor.position.top + 1], [anchor.position.right - 1, anchor.position.bottom - 1], [anchor.position.left + 1, anchor.position.bottom - 1]];

      var childNodes = anchorNode.childNodes;
      if (childNodes.length === 0) return false;
      var childNode = childNodes[0];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          var element = document.elementFromPoint(point[0] - window.pageXOffset, point[1] - window.pageYOffset);
          if (element === childNode || (0, _jquery2.default)(element).find(childNode).length > 0 || (0, _jquery2.default)(childNode).find(element).length > 0) return true;
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
    key: '_collect',
    value: function _collect(node) {
      if (!this.candidateAnchorNodes.includes(node)) this.candidateAnchorNodes.push(node);
    }
  }, {
    key: '_dfs',
    value: function _dfs(node, depth) {
      // register anchor node
      if (node.nodeName.toLowerCase() === 'a') {
        var href = node.href;
        if (this.options.onlyHttpUrl) {
          if (href.startsWith('http')) this._collect(node);
        } else {
          this._collect(node);
        }
      }

      if (depth > this.options.maxDepth) return;
      this.visited.push(node);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = node.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var childNode = _step2.value;

          if (!this.visited.includes(childNode)) this._dfs(childNode, depth + 1);
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
    }
  }, {
    key: 'find',
    value: function find(_ref2) {
      var top = _ref2.top,
          left = _ref2.left,
          bottom = _ref2.bottom,
          right = _ref2.right;

      if (!top || !left || !bottom || !right) return [];
      this.initialize();
      this.range = { top: top, left: left, bottom: bottom, right: right };
      this._dfs(this.root, 0);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.candidateAnchorNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var anchorNode = _step3.value;

          var rect = anchorNode.getBoundingClientRect();
          if (this.options.excludeInvisibles && rect.top === 0 && rect.bottom === 0 && rect.left === 0 && rect.right === 0) {
            continue;
          }
          var anchor = {
            text: anchorNode.innerText.trim(),
            url: anchorNode.href || '',
            position: {
              top: rect.top + window.scrollY,
              left: rect.left + window.scrollX,
              bottom: rect.bottom + window.scrollY,
              right: rect.right + window.scrollX
            }
          };

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