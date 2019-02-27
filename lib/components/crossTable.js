'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //基本类库


// 第三方组件库 -- 单文件引入


//常量
var KEY_SPLIT = '_';
var COL_WIDTH = 138;

var NULL_TEXT = '-';
//表格默认配置
var defaultOpts = {
    size: 'middle',
    bordered: true,
    pagination: false
    //交叉表
};
var crossTable = function (_Component) {
    _inherits(crossTable, _Component);

    function crossTable(props) {
        _classCallCheck(this, crossTable);

        var _this = _possibleConstructorReturn(this, (crossTable.__proto__ || Object.getPrototypeOf(crossTable)).call(this));

        _this.state = {};
        return _this;
    }

    _createClass(crossTable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                tableData = _props.tableData,
                customOpts = _props.customOpts;

            var tableOpts = geTableOpts.call(this, tableData);
            Object.assign(tableOpts, defaultOpts, customOpts);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_antd.Table, tableOpts)
            );
        }
    }]);

    return crossTable;
}(_react.Component);

//获取表格配置项


exports.default = crossTable;
function geTableOpts(tableData) {
    if (!tableData) return {};
    var title = tableData.title,
        value = tableData.value,
        map = tableData.map;

    var dataSource = getDataSource(tableData);

    var rowKeys = [];
    value.map(function (rowData) {
        rowKeys.push(rowData[0].rowKey);
    });

    var col1Keys = [];
    var col2Keys = [];

    rowKeys.map(function (rowKey) {
        var _rowKey$split = rowKey.split(KEY_SPLIT),
            _rowKey$split2 = _slicedToArray(_rowKey$split, 3),
            col1Key = _rowKey$split2[0],
            col2Key = _rowKey$split2[1],
            col3Key = _rowKey$split2[2];

        col1Keys.push(col1Key);
        col2Keys.push(col2Key);
    });

    var col1RowSpanMeta = getRowSpanMetaData(col1Keys);
    var col2RowSpanMeta = getRowSpanMetaData(col2Keys);

    var columns = [{
        title: '部门',
        dataIndex: 'deptInfo',
        key: 'deptInfo',
        width: 100,
        fixed: 'left',
        className: 'text-center left-header',
        render: getRowSpanRender(col1RowSpanMeta)
    }, {
        title: '科目',
        dataIndex: 'subject',
        key: 'name',
        fixed: 'left',
        className: 'text-center left-header',
        width: 100,
        render: getRowSpanRender(col2RowSpanMeta)
    }, {
        title: '模式',
        dataIndex: 'pattern',
        className: 'text-center left-header',
        key: 'pattern',
        width: 100,
        fixed: 'left'
    }];

    var cols = [];

    var getHeader = function getHeader(title) {
        return title.map(function (t, i) {
            var item = {};

            if (t.children) {
                item.title = t.key;
                item.children = getHeader(t.children);
            } else {
                Object.assign(item, t, {
                    title: getColTitle(t.key, map),
                    dataIndex: t.key,
                    width: COL_WIDTH,
                    align: 'right'
                });
                item.render = function (cell, row, index) {
                    var text = cell.val;
                    if (isNaN(text) || text === '') {
                        return NULL_TEXT;
                    }
                    return text;
                };
            }
            return item;
        });
    };
    cols = getHeader(title);

    //动态添加月份列
    columns.push.apply(columns, _toConsumableArray(cols));

    var tableOpts = {
        columns: columns, dataSource: dataSource
    };
    var contentWidth = this.props.contentWidth;

    if (contentWidth) {
        tableOpts.contentWidth = contentWidth;
        dealScroll(tableOpts);
    }

    return tableOpts;
}

function getRowSpanRender(RowSpanMetaData) {
    return function (text, row, index) {
        var rowSpan = void 0;
        if (RowSpanMetaData[index]) {
            rowSpan = RowSpanMetaData[index];
        } else {
            rowSpan = 0;
        }
        return {
            children: text,
            props: {
                rowSpan: rowSpan
            }
        };
    };
}
//获取行合并元数据
function getRowSpanMetaData(keyList) {
    var rs = {};
    var count = 1;
    for (var i = 0; i < keyList.length; i++) {
        var current = keyList[i];
        var next = keyList[i + 1];
        if (current === next) {
            count++;
        } else {
            rs[i + 1 - count] = count;
            count = 1;
        }
    }
    return rs;
}

function getDataSource(tableData) {
    var title = tableData.title,
        value = tableData.value,
        map = tableData.map;
    //组装表格数据

    var data = [];
    value.map(function (row, i) {
        var rowData = {};
        row.map(function (cell) {
            rowData[cell.columnKey] = cell;
            rowData.rowKey = cell.rowKey;
        });
        //添加左侧表头数据 [科目-部门-模式]
        var keys = rowData.rowKey.split(KEY_SPLIT);
        var deptKey = keys[0];
        var subjectKey = keys[1];
        var patternKey = keys[2];
        rowData.deptInfo = map.deptInfo[deptKey];
        rowData.subject = map.subject[subjectKey];
        rowData.pattern = map.pattern[patternKey];

        data.push(rowData);
    });
    return data;
}

/**
 * 获取表格的列名
 * @param key
 * @param map
 * @returns {*}
 */
function getColTitle(colkey, map) {
    var preference = map.preference;

    var key = colkey.split(KEY_SPLIT)[1];
    return preference[key] || key;
}

function dealScroll(tableOpts) {
    var scroll = getScroll(tableOpts);
    var style = getTableStyle(scroll, tableOpts.contentWidth);
    Object.assign(tableOpts, {
        style: style
    });
    if (tableOpts.contentWidth < scroll.x) {
        Object.assign(tableOpts, {
            scroll: scroll
        });
    }
}

//将父子结构的columns 转换成平的数组
function getFlattenCols(columns) {
    var totalCols = [];
    var flattenCols = function flattenCols(columns) {
        columns.map(function (col) {
            if (!col.children) {
                totalCols.push(col);
            } else {
                flattenCols(col.children);
            }
        });
    };
    flattenCols(columns);
    return totalCols;
}

function getTableStyle(scroll, contWidth) {
    var tableStyle = {
        width: scroll.x < contWidth ? scroll.x : contWidth
    };
    return tableStyle;
}

/**
 * 获取表格滚动配置
 * @param tableOpt 表格配置项 {data,columns}
 * @returns {*}
 */
function getScroll(tableOpt) {
    var columns = tableOpt.columns;

    var flattenCols = getFlattenCols(columns);
    var scrollWidth = flattenCols.reduce(function (result, item) {
        var width = item.width || COL_WIDTH;
        return result + width;
    }, 0);
    //多加的2px是兼容firefox
    var scroll = {
        x: scrollWidth + 2
    };

    return scroll;
}