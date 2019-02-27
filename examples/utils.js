
import  { rs_treeData,rs_tableData } from './mockData'
export function loadTreeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rs_treeData.data)
    }, 1000)
  })
}

export function loadTableData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rs_tableData.data)
    }, 1000)
  })
}
