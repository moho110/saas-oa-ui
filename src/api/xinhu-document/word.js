import request from '@/utils/request'

// 查询文档列表
export function listWord(query) {
  return request({
    url: '/xinhu-document/word/list',
    method: 'get',
    params: query
  })
}

// 查询文档详细
export function getWord(id) {
  return request({
    url: '/xinhu-document/word/' + id,
    method: 'get'
  })
}

// 新增文档
export function addWord(data) {
  return request({
    url: '/xinhu-document/word',
    method: 'post',
    data: data
  })
}

// 修改文档
export function updateWord(data) {
  return request({
    url: '/xinhu-document/word',
    method: 'put',
    data: data
  })
}

// 删除文档
export function delWord(id) {
  return request({
    url: '/xinhu-document/word/' + id,
    method: 'delete'
  })
}
