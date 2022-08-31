import request from '@/utils/request'

// 查询考勤机上人员列表
export function listKqjuser(query) {
  return request({
    url: '/xinhu-hr/kqjuser/list',
    method: 'get',
    params: query
  })
}

// 查询考勤机上人员详细
export function getKqjuser(id) {
  return request({
    url: '/xinhu-hr/kqjuser/' + id,
    method: 'get'
  })
}

// 新增考勤机上人员
export function addKqjuser(data) {
  return request({
    url: '/xinhu-hr/kqjuser',
    method: 'post',
    data: data
  })
}

// 修改考勤机上人员
export function updateKqjuser(data) {
  return request({
    url: '/xinhu-hr/kqjuser',
    method: 'put',
    data: data
  })
}

// 删除考勤机上人员
export function delKqjuser(id) {
  return request({
    url: '/xinhu-hr/kqjuser/' + id,
    method: 'delete'
  })
}
