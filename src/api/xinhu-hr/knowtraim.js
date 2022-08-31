import request from '@/utils/request'

// 查询培训出题考试列表
export function listKnowtraim(query) {
  return request({
    url: '/xinhu-hr/knowtraim/list',
    method: 'get',
    params: query
  })
}

// 查询培训出题考试详细
export function getKnowtraim(id) {
  return request({
    url: '/xinhu-hr/knowtraim/' + id,
    method: 'get'
  })
}

// 新增培训出题考试
export function addKnowtraim(data) {
  return request({
    url: '/xinhu-hr/knowtraim',
    method: 'post',
    data: data
  })
}

// 修改培训出题考试
export function updateKnowtraim(data) {
  return request({
    url: '/xinhu-hr/knowtraim',
    method: 'put',
    data: data
  })
}

// 删除培训出题考试
export function delKnowtraim(id) {
  return request({
    url: '/xinhu-hr/knowtraim/' + id,
    method: 'delete'
  })
}
