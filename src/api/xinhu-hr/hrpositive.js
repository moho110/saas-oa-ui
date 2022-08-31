import request from '@/utils/request'

// 查询HR转正列表
export function listHrpositive(query) {
  return request({
    url: '/xinhu-hr/hrpositive/list',
    method: 'get',
    params: query
  })
}

// 查询HR转正详细
export function getHrpositive(id) {
  return request({
    url: '/xinhu-hr/hrpositive/' + id,
    method: 'get'
  })
}

// 新增HR转正
export function addHrpositive(data) {
  return request({
    url: '/xinhu-hr/hrpositive',
    method: 'post',
    data: data
  })
}

// 修改HR转正
export function updateHrpositive(data) {
  return request({
    url: '/xinhu-hr/hrpositive',
    method: 'put',
    data: data
  })
}

// 删除HR转正
export function delHrpositive(id) {
  return request({
    url: '/xinhu-hr/hrpositive/' + id,
    method: 'delete'
  })
}
