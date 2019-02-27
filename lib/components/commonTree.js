'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //基本类库


// 第三方组件库 -- 单文件引入


//常量
var TreeNode = _antd.Tree.TreeNode;
var Search = _antd.Input.Search;

//树默认配置项
var defaultOpts = {};
//交叉表

var CommonTree = function (_Component) {
    _inherits(CommonTree, _Component);

    function CommonTree(props) {
        _classCallCheck(this, CommonTree);

        var _this = _possibleConstructorReturn(this, (CommonTree.__proto__ || Object.getPrototypeOf(CommonTree)).call(this));

        _this.getTreeNodeMap = function (treeData) {
            var map = {};
            var parentId = void 0;
            var loop = function loop(data, parentId) {
                map[data.deptId] = data;
                if (parentId) {
                    data.parentId = parentId;
                }
                if (data.child && data.child.length > 0) {
                    var _parentId = data.deptId;
                    data.child.map(function (d) {
                        loop(d, data.deptId);
                    });
                }
            };
            loop(treeData);
            return map;
        };

        _this.onExpand = function (expandedKeys) {
            _antd.message.info("expanded keys is ：" + expandedKeys.toString());
            _this.setState({
                expandedKeys: expandedKeys,
                autoExpandParent: false
            });
        };

        _this.onChange = function (e) {
            var value = e.target.value;
            var expandedKeys = [];
            for (var k in _this.treeNodeMap) {
                var node = _this.treeNodeMap[k];
                if (node.deptName.indexOf(value) > -1) {
                    expandedKeys.push(node.parentId);
                }
            }

            _this.setState({
                expandedKeys: expandedKeys,
                searchValue: value,
                autoExpandParent: true
            });
        };

        _this.loop = function (treeData) {
            if (!treeData[0]) return null;
            var _this$state = _this.state,
                searchValue = _this$state.searchValue,
                expandedKeys = _this$state.expandedKeys,
                autoExpandParent = _this$state.autoExpandParent;

            return treeData.map(function (item) {
                var index = item.deptName.indexOf(searchValue);
                var beforeStr = item.deptName.substr(0, index);
                var afterStr = item.deptName.substr(index + searchValue.length);

                var title = index > -1 ? _react2.default.createElement(
                    'span',
                    null,
                    beforeStr,
                    _react2.default.createElement(
                        'span',
                        { style: { color: '#f50' } },
                        searchValue
                    ),
                    afterStr
                ) : _react2.default.createElement(
                    'span',
                    null,
                    item.deptName
                );
                if (item.child && item.child.length > 0) {
                    return _react2.default.createElement(
                        TreeNode,
                        { key: item.deptId, title: title },
                        _this.loop(item.child)
                    );
                } else {
                    return _react2.default.createElement(TreeNode, { key: item.deptId, title: title });
                }
            });
        };

        _this.treeNodeMap = {};
        _this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true
        };
        return _this;
    }

    _createClass(CommonTree, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                expandedKeys = _state.expandedKeys,
                searchValue = _state.searchValue,
                autoExpandParent = _state.autoExpandParent;
            var _props = this.props,
                treeData = _props.treeData,
                treeOpts = _props.treeOpts,
                treeNodes = _props.treeNodes,
                searchOpts = _props.searchOpts,
                showSearch = _props.showSearch;


            if (!treeNodes) {
                treeNodes = this.loop([treeData]);
            }
            if (treeData) {
                this.treeNodeMap = this.getTreeNodeMap(treeData);
            }

            var options = {
                onExpand: this.onExpand,
                expandedKeys: expandedKeys,
                searchValue: searchValue,
                autoExpandParent: autoExpandParent
            };

            Object.assign(options, defaultOpts, treeOpts);
            var style1 = { width: 200 };
            var style2 = { marginBottom: 10 };
            return _react2.default.createElement(
                'div',
                { style: style1 },
                showSearch ? _react2.default.createElement(Search, _extends({ style: style2 }, searchOpts, { onChange: this.onChange })) : null,
                _react2.default.createElement(
                    _antd.Tree,
                    options,
                    treeNodes
                )
            );
        }
    }]);

    return CommonTree;
}(_react.Component);

exports.default = CommonTree;