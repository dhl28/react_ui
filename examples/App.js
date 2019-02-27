import React, { Component } from 'react';
import { message, Tabs } from 'antd'
import './App.css';
import CommonTree from '@src/components/commonTree.js'
import CrossTable from '@src/components/crossTable.js'
import * as utils from './utils'
const { TabPane } = Tabs
const tableWrapStyle = {
  margin: '20px auto',
  width: '900px'
}

function callback(key) {
  console.log(key);
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      treeData: null,
      tableData: null,
      customOpts: {
        rowKey: 'rowKey'
      },
      treeOpts: {
        onSelect: this.onSelect
      },
      searchOpts: { placeholder: '输入名称或者id进行搜素' }
    }
  }

  onSelect = (keys) => {
    message.info('select key is :' + keys.toString())
  }

  componentDidMount() {
    utils.loadTreeData().then((data) => {
      this.setState({ treeData: data })
    })
    utils.loadTableData().then((data) => {
      this.setState({ tableData: data })
    })
  }
  render() {
    const { treeOpts, searchOpts, treeData, tableData, customOpts } = this.state
    return (
      <div className="App">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="树形控件" key="1">
            <CommonTree treeOpts={treeOpts} showSearch searchOpts={searchOpts} treeData={treeData}></CommonTree>
          </TabPane>
          <TabPane tab="表格控件" key="2">
            <div style={tableWrapStyle}>
              <CrossTable tableData={tableData} customOpts={customOpts} contentWidth={1826}></CrossTable>
            </div>

          </TabPane>
        </Tabs>,

      </div>
    );
  }
}

export default App;
