import request from '@/utils/request'

// 查询演示测试模块列表
export function listDemo(query) {
  return request({
    url: '/xinhu-finance/demo/list',
    method: 'get',
    params: query
  })
}

// 查询演示测试模块详细
export function getDemo(id) {
  return request({
    url: '/xinhu-finance/demo/' + id,
    method: 'get'
  })
}

// 新增演示测试模块
export function addDemo(data) {
  return request({
    url: '/xinhu-finance/demo',
    method: 'post',
    data: data
  })
}

// 修改演示测试模块
export function updateDemo(data) {
  return request({
    url: '/xinhu-finance/demo',
    method: 'put',
    data: data
  })
}

// 删除演示测试模块
export function delDemo(id) {
  return request({
    url: '/xinhu-finance/demo/' + id,
    method: 'delete'
  })
}
