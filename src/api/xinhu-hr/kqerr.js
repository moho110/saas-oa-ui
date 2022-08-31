import request from '@/utils/request'

// 查询打卡异常申请列表
export function listKqerr(query) {
  return request({
    url: '/xinhu-hr/kqerr/list',
    method: 'get',
    params: query
  })
}

// 查询打卡异常申请详细
export function getKqerr(id) {
  return request({
    url: '/xinhu-hr/kqerr/' + id,
    method: 'get'
  })
}

// 新增打卡异常申请
export function addKqerr(data) {
  return request({
    url: '/xinhu-hr/kqerr',
    method: 'post',
    data: data
  })
}

// 修改打卡异常申请
export function updateKqerr(data) {
  return request({
    url: '/xinhu-hr/kqerr',
    method: 'put',
    data: data
  })
}

// 删除打卡异常申请
export function delKqerr(id) {
  return request({
    url: '/xinhu-hr/kqerr/' + id,
    method: 'delete'
  })
}
