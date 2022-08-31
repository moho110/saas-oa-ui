import request from '@/utils/request'

// 查询系统选项列表
export function listOption(query) {
  return request({
    url: '/xinhu-system/option/list',
    method: 'get',
    params: query
  })
}

// 查询系统选项详细
export function getOption(id) {
  return request({
    url: '/xinhu-system/option/' + id,
    method: 'get'
  })
}

// 新增系统选项
export function addOption(data) {
  return request({
    url: '/xinhu-system/option',
    method: 'post',
    data: data
  })
}

// 修改系统选项
export function updateOption(data) {
  return request({
    url: '/xinhu-system/option',
    method: 'put',
    data: data
  })
}

// 删除系统选项
export function delOption(id) {
  return request({
    url: '/xinhu-system/option/' + id,
    method: 'delete'
  })
}
