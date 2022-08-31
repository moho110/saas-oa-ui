import request from '@/utils/request'

// 查询请假条加班单列表
export function listKqinfo(query) {
  return request({
    url: '/xinhu-hr/kqinfo/list',
    method: 'get',
    params: query
  })
}

// 查询请假条加班单详细
export function getKqinfo(id) {
  return request({
    url: '/xinhu-hr/kqinfo/' + id,
    method: 'get'
  })
}

// 新增请假条加班单
export function addKqinfo(data) {
  return request({
    url: '/xinhu-hr/kqinfo',
    method: 'post',
    data: data
  })
}

// 修改请假条加班单
export function updateKqinfo(data) {
  return request({
    url: '/xinhu-hr/kqinfo',
    method: 'put',
    data: data
  })
}

// 删除请假条加班单
export function delKqinfo(id) {
  return request({
    url: '/xinhu-hr/kqinfo/' + id,
    method: 'delete'
  })
}
