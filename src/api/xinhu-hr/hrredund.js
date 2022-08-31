import request from '@/utils/request'

// 查询离职申请列表
export function listHrredund(query) {
  return request({
    url: '/xinhu-hr/hrredund/list',
    method: 'get',
    params: query
  })
}

// 查询离职申请详细
export function getHrredund(id) {
  return request({
    url: '/xinhu-hr/hrredund/' + id,
    method: 'get'
  })
}

// 新增离职申请
export function addHrredund(data) {
  return request({
    url: '/xinhu-hr/hrredund',
    method: 'post',
    data: data
  })
}

// 修改离职申请
export function updateHrredund(data) {
  return request({
    url: '/xinhu-hr/hrredund',
    method: 'put',
    data: data
  })
}

// 删除离职申请
export function delHrredund(id) {
  return request({
    url: '/xinhu-hr/hrredund/' + id,
    method: 'delete'
  })
}
