import request from '@/utils/request'

// 查询外出出差列表
export function listKqout(query) {
  return request({
    url: '/xinhu-hr/kqout/list',
    method: 'get',
    params: query
  })
}

// 查询外出出差详细
export function getKqout(id) {
  return request({
    url: '/xinhu-hr/kqout/' + id,
    method: 'get'
  })
}

// 新增外出出差
export function addKqout(data) {
  return request({
    url: '/xinhu-hr/kqout',
    method: 'post',
    data: data
  })
}

// 修改外出出差
export function updateKqout(data) {
  return request({
    url: '/xinhu-hr/kqout',
    method: 'put',
    data: data
  })
}

// 删除外出出差
export function delKqout(id) {
  return request({
    url: '/xinhu-hr/kqout/' + id,
    method: 'delete'
  })
}
