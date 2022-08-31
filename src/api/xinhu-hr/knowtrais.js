import request from '@/utils/request'

// 查询考试培训子列表
export function listKnowtrais(query) {
  return request({
    url: '/xinhu-hr/knowtrais/list',
    method: 'get',
    params: query
  })
}

// 查询考试培训子详细
export function getKnowtrais(id) {
  return request({
    url: '/xinhu-hr/knowtrais/' + id,
    method: 'get'
  })
}

// 新增考试培训子
export function addKnowtrais(data) {
  return request({
    url: '/xinhu-hr/knowtrais',
    method: 'post',
    data: data
  })
}

// 修改考试培训子
export function updateKnowtrais(data) {
  return request({
    url: '/xinhu-hr/knowtrais',
    method: 'put',
    data: data
  })
}

// 删除考试培训子
export function delKnowtrais(id) {
  return request({
    url: '/xinhu-hr/knowtrais/' + id,
    method: 'delete'
  })
}
