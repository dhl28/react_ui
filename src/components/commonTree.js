//基本类库
import React, { Component } from 'react';

// 第三方组件库 -- 单文件引入
import { Tree, Input, message } from 'antd';

//常量
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

//树默认配置项
const defaultOpts = {}
//交叉表

export default class CommonTree extends Component {
    constructor(props) {
        super();
        this.treeNodeMap = {}
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        }
    }

   

    componentDidMount() {

    }

    getTreeNodeMap = (treeData) => {
        let map = {};
        let parentId;
        const loop = (data, parentId) => {
            map[data.deptId] = data;
            if (parentId) {
                data.parentId = parentId;
            }
            if (data.child && data.child.length > 0) {
                let parentId = data.deptId;
                data.child.map(d => {
                    loop(d, data.deptId)
                })
            }
        }
        loop(treeData);
        return map;
    }

    onExpand = (expandedKeys) => {
        message.info("expanded keys is ：" + expandedKeys.toString())
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onChange = (e) => {
        const value = e.target.value;
        let expandedKeys = [];
        for (let k in this.treeNodeMap) {
            let node = this.treeNodeMap[k]
            if (node.deptName.indexOf(value) > -1) {
                expandedKeys.push(node.parentId);
            }
        }

        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    loop = (treeData) => {
        if (!treeData[0]) return null;
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        return treeData.map(item => {
            const index = item.deptName.indexOf(searchValue);
            const beforeStr = item.deptName.substr(0, index);
            const afterStr = item.deptName.substr(index + searchValue.length);

            const title = index > -1 ? (
                <span>{beforeStr}<span style={{ color: '#f50' }}>{searchValue}</span>{afterStr}
                </span>) : <span>{item.deptName}</span>;
            if (item.child && item.child.length > 0) {
                return (
                    <TreeNode key={item.deptId} title={title}>
                        {this.loop(item.child)}
                    </TreeNode>
                );
            } else {
                return <TreeNode key={item.deptId} title={title} />;
            }
        })


    }

    render() {
        let { expandedKeys, searchValue, autoExpandParent } = this.state
        let { treeData, treeOpts, treeNodes, searchOpts, showSearch } = this.props;

        if (!treeNodes) {
            treeNodes = this.loop([treeData]);
        }
        if (treeData) {
            this.treeNodeMap = this.getTreeNodeMap(treeData)
        }

        let options = {
            onExpand: this.onExpand,
            expandedKeys,
            searchValue,
            autoExpandParent
        };

        Object.assign(options, defaultOpts, treeOpts)
        const style1 = { width: 200 }
        const style2 = { marginBottom: 10 }
        return <div style={style1}>
            {showSearch ? <Search style={style2} {...searchOpts} onChange={this.onChange} /> : null}
            <Tree {...options}>
                {treeNodes}
            </Tree>
        </div>

    }
}

