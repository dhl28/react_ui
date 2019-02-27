
import  { rs_treeData } from './mockData'
export function loadTreeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rs_treeData.data)
    }, 1000)
  })
}