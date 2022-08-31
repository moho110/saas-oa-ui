import request from '@/utils/request'

// 查询考勤机命令发送列表
export function listKqjcmd(query) {
  return request({
    url: '/xinhu-hr/kqjcmd/list',
    method: 'get',
    params: query
  })
}

// 查询考勤机命令发送详细
export function getKqjcmd(id) {
  return request({
    url: '/xinhu-hr/kqjcmd/' + id,
    method: 'get'
  })
}

// 新增考勤机命令发送
export function addKqjcmd(data) {
  return request({
    url: '/xinhu-hr/kqjcmd',
    method: 'post',
    data: data
  })
}

// 修改考勤机命令发送
export function updateKqjcmd(data) {
  return request({
    url: '/xinhu-hr/kqjcmd',
    method: 'put',
    data: data
  })
}

// 删除考勤机命令发送
export function delKqjcmd(id) {
  return request({
    url: '/xinhu-hr/kqjcmd/' + id,
    method: 'delete'
  })
}
