import request from '@/utils/request'

// 查询职位调动列表
export function listHrtransfer(query) {
  return request({
    url: '/xinhu-hr/hrtransfer/list',
    method: 'get',
    params: query
  })
}

// 查询职位调动详细
export function getHrtransfer(id) {
  return request({
    url: '/xinhu-hr/hrtransfer/' + id,
    method: 'get'
  })
}

// 新增职位调动
export function addHrtransfer(data) {
  return request({
    url: '/xinhu-hr/hrtransfer',
    method: 'post',
    data: data
  })
}

// 修改职位调动
export function updateHrtransfer(data) {
  return request({
    url: '/xinhu-hr/hrtransfer',
    method: 'put',
    data: data
  })
}

// 删除职位调动
export function delHrtransfer(id) {
  return request({
    url: '/xinhu-hr/hrtransfer/' + id,
    method: 'delete'
  })
}
