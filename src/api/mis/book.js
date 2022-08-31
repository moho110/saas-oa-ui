import request from '@/utils/request'

// 查询图书列表列表
export function listBook(query) {
  return request({
    url: '/mis/book/list',
    method: 'get',
    params: query
  })
}

// 查询图书列表详细
export function getBook(id) {
  return request({
    url: '/mis/book/' + id,
    method: 'get'
  })
}

// 新增图书列表
export function addBook(data) {
  return request({
    url: '/mis/book',
    method: 'post',
    data: data
  })
}

// 修改图书列表
export function updateBook(data) {
  return request({
    url: '/mis/book',
    method: 'put',
    data: data
  })
}

// 删除图书列表
export function delBook(id) {
  return request({
    url: '/mis/book/' + id,
    method: 'delete'
  })
}
