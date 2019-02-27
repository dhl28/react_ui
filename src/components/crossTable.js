//基本类库
import React, { Component } from 'react';

// 第三方组件库 -- 单文件引入
import { Table } from 'antd';

//常量
const KEY_SPLIT = '_'
const COL_WIDTH = 138

const NULL_TEXT = '-'
//表格默认配置
const defaultOpts = {
    size: 'middle',
    bordered: true,
    pagination: false
}
//交叉表
export default class crossTable extends Component {
    constructor(props) {
        super();
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        let { tableData, customOpts } = this.props;
        let tableOpts = geTableOpts.call(this, tableData)
        Object.assign(tableOpts, defaultOpts, customOpts)
        return <div>
            <Table {...tableOpts} />
        </div>
    }
}



//获取表格配置项
function geTableOpts(tableData) {
    if (!tableData) return {}
    let { title, value, map } = tableData;
    let dataSource = getDataSource(tableData)

    let rowKeys = [];
    value.map(rowData => {
        rowKeys.push(rowData[0].rowKey)
    })

    let col1Keys = []
    let col2Keys = []

    rowKeys.map(rowKey => {
        let [col1Key, col2Key, col3Key] = rowKey.split(KEY_SPLIT)
        col1Keys.push(col1Key)
        col2Keys.push(col2Key)
    })

    let col1RowSpanMeta = getRowSpanMetaData(col1Keys)
    let col2RowSpanMeta = getRowSpanMetaData(col2Keys)

    const columns = [{
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
        fixed: 'left',
    }];

    let cols = [];

    const getHeader = (title) => {
        return title.map((t, i) => {
            let item = {};

            if (t.children) {
                item.title = t.key
                item.children = getHeader(t.children);
            } else {
                Object.assign(item, t, {
                    title: getColTitle(t.key, map),
                    dataIndex: t.key,
                    width: COL_WIDTH,
                    align:'right'
                });
                item.render = (cell, row, index) => {
                    let text = cell.val
                    if (isNaN(text) || text === '') {
                        return NULL_TEXT
                    }
                    return text
                }
            }
            return item;
        })
    }
    cols = getHeader(title);

    //动态添加月份列
    columns.push(...cols);


    let tableOpts = {
        columns, dataSource
    }
    let { contentWidth } = this.props
    if (contentWidth) {
        tableOpts.contentWidth = contentWidth
        dealScroll(tableOpts)
    }

    return tableOpts
}

function getRowSpanRender(RowSpanMetaData) {
    return function (text, row, index) {
        let rowSpan
        if (RowSpanMetaData[index]) {
            rowSpan = RowSpanMetaData[index]
        } else {
            rowSpan = 0;
        }
        return {
            children: text,
            props: {
                rowSpan
            },
        };
    }
}
//获取行合并元数据
function getRowSpanMetaData(keyList) {
    let rs = {};
    let count = 1;
    for (let i = 0; i < keyList.length; i++) {
        let current = keyList[i];
        let next = keyList[i + 1];
        if (current === next) {
            count++
        } else {
            rs[(i + 1) - count] = count
            count = 1
        }

    }
    return rs
}

function getDataSource(tableData) {
    let { title, value, map } = tableData;
    //组装表格数据
    const data = [];
    value.map((row, i) => {
        let rowData = {}
        row.map(cell => {
            rowData[cell.columnKey] = cell;
            rowData.rowKey = cell.rowKey
        })
        //添加左侧表头数据 [科目-部门-模式]
        let keys = rowData.rowKey.split(KEY_SPLIT);
        let deptKey = keys[0];
        let subjectKey = keys[1];
        let patternKey = keys[2];
        rowData.deptInfo = map.deptInfo[deptKey];
        rowData.subject = map.subject[subjectKey];
        rowData.pattern = map.pattern[patternKey];

        data.push(rowData);
    })
    return data
}

/**
 * 获取表格的列名
 * @param key
 * @param map
 * @returns {*}
 */
function getColTitle(colkey, map) {
    let { preference } = map;
    let key = colkey.split(KEY_SPLIT)[1];
    return preference[key] || key;
}

function dealScroll(tableOpts) {
    let scroll = getScroll(tableOpts);
    let style = getTableStyle(scroll, tableOpts.contentWidth)
    Object.assign(tableOpts, {
        style
    })
    if (tableOpts.contentWidth < scroll.x) {
        Object.assign(tableOpts, {
            scroll
        })
    }


}

//将父子结构的columns 转换成平的数组
function getFlattenCols(columns) {
    let totalCols = [];
    const flattenCols = (columns) => {
        columns.map(col => {
            if (!col.children) {
                totalCols.push(col);
            } else {
                flattenCols(col.children)
            }
        })
    }
    flattenCols(columns);
    return totalCols;
}

function getTableStyle(scroll, contWidth) {
    let tableStyle = {
        width: scroll.x < contWidth ? scroll.x : contWidth
    }
    return tableStyle
}

/**
 * 获取表格滚动配置
 * @param tableOpt 表格配置项 {data,columns}
 * @returns {*}
 */
function getScroll(tableOpt) {
    let { columns } = tableOpt;
    let flattenCols = getFlattenCols(columns);
    let scrollWidth = flattenCols.reduce((result, item) => {
        let width = item.width || COL_WIDTH;
        return result + width
    }, 0);
    //多加的2px是兼容firefox
    let scroll = {
        x: scrollWidth + 2
    }

    return scroll
}
