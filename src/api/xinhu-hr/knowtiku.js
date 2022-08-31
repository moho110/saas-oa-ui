import request from '@/utils/request'

// 查询知识题库列表
export function listKnowtiku(query) {
  return request({
    url: '/xinhu-hr/knowtiku/list',
    method: 'get',
    params: query
  })
}

// 查询知识题库详细
export function getKnowtiku(id) {
  return request({
    url: '/xinhu-hr/knowtiku/' + id,
    method: 'get'
  })
}

// 新增知识题库
export function addKnowtiku(data) {
  return request({
    url: '/xinhu-hr/knowtiku',
    method: 'post',
    data: data
  })
}

// 修改知识题库
export function updateKnowtiku(data) {
  return request({
    url: '/xinhu-hr/knowtiku',
    method: 'put',
    data: data
  })
}

// 删除知识题库
export function delKnowtiku(id) {
  return request({
    url: '/xinhu-hr/knowtiku/' + id,
    method: 'delete'
  })
}
