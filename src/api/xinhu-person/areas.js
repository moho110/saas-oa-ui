import request from '@/utils/request'

// 查询区域表列表
export function listAreas(query) {
  return request({
    url: '/xinhu-person/areas/list',
    method: 'get',
    params: query
  })
}

// 查询区域表详细
export function getAreas(id) {
  return request({
    url: '/xinhu-person/areas/' + id,
    method: 'get'
  })
}

// 新增区域表
export function addAreas(data) {
  return request({
    url: '/xinhu-person/areas',
    method: 'post',
    data: data
  })
}

// 修改区域表
export function updateAreas(data) {
  return request({
    url: '/xinhu-person/areas',
    method: 'put',
    data: data
  })
}

// 删除区域表
export function delAreas(id) {
  return request({
    url: '/xinhu-person/areas/' + id,
    method: 'delete'
  })
}
