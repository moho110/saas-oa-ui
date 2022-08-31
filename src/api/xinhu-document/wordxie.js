import request from '@/utils/request'

// 查询文档协作列表
export function listWordxie(query) {
  return request({
    url: '/xinhu-document/wordxie/list',
    method: 'get',
    params: query
  })
}

// 查询文档协作详细
export function getWordxie(id) {
  return request({
    url: '/xinhu-document/wordxie/' + id,
    method: 'get'
  })
}

// 新增文档协作
export function addWordxie(data) {
  return request({
    url: '/xinhu-document/wordxie',
    method: 'post',
    data: data
  })
}

// 修改文档协作
export function updateWordxie(data) {
  return request({
    url: '/xinhu-document/wordxie',
    method: 'put',
    data: data
  })
}

// 删除文档协作
export function delWordxie(id) {
  return request({
    url: '/xinhu-document/wordxie/' + id,
    method: 'delete'
  })
}
