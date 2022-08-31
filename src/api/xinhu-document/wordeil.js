import request from '@/utils/request'

// 查询文件传送列表
export function listWordeil(query) {
  return request({
    url: '/xinhu-document/wordeil/list',
    method: 'get',
    params: query
  })
}

// 查询文件传送详细
export function getWordeil(id) {
  return request({
    url: '/xinhu-document/wordeil/' + id,
    method: 'get'
  })
}

// 新增文件传送
export function addWordeil(data) {
  return request({
    url: '/xinhu-document/wordeil',
    method: 'post',
    data: data
  })
}

// 修改文件传送
export function updateWordeil(data) {
  return request({
    url: '/xinhu-document/wordeil',
    method: 'put',
    data: data
  })
}

// 删除文件传送
export function delWordeil(id) {
  return request({
    url: '/xinhu-document/wordeil/' + id,
    method: 'delete'
  })
}
