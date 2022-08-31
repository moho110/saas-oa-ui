import request from '@/utils/request'

// 查询人脸识别列表
export function listRenlian(query) {
  return request({
    url: '/xinhu-system/renlian/list',
    method: 'get',
    params: query
  })
}

// 查询人脸识别详细
export function getRenlian(id) {
  return request({
    url: '/xinhu-system/renlian/' + id,
    method: 'get'
  })
}

// 新增人脸识别
export function addRenlian(data) {
  return request({
    url: '/xinhu-system/renlian',
    method: 'post',
    data: data
  })
}

// 修改人脸识别
export function updateRenlian(data) {
  return request({
    url: '/xinhu-system/renlian',
    method: 'put',
    data: data
  })
}

// 删除人脸识别
export function delRenlian(id) {
  return request({
    url: '/xinhu-system/renlian/' + id,
    method: 'delete'
  })
}
