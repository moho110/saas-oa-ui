import request from '@/utils/request'

// 查询知识信息列表
export function listKnowledge(query) {
  return request({
    url: '/xinhu-hr/knowledge/list',
    method: 'get',
    params: query
  })
}

// 查询知识信息详细
export function getKnowledge(id) {
  return request({
    url: '/xinhu-hr/knowledge/' + id,
    method: 'get'
  })
}

// 新增知识信息
export function addKnowledge(data) {
  return request({
    url: '/xinhu-hr/knowledge',
    method: 'post',
    data: data
  })
}

// 修改知识信息
export function updateKnowledge(data) {
  return request({
    url: '/xinhu-hr/knowledge',
    method: 'put',
    data: data
  })
}

// 删除知识信息
export function delKnowledge(id) {
  return request({
    url: '/xinhu-hr/knowledge/' + id,
    method: 'delete'
  })
}
