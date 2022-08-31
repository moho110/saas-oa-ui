import request from '@/utils/request'

// 查询图书借阅列表
export function listBookborrow(query) {
  return request({
    url: '/xinhu-person/bookborrow/list',
    method: 'get',
    params: query
  })
}

// 查询图书借阅详细
export function getBookborrow(id) {
  return request({
    url: '/xinhu-person/bookborrow/' + id,
    method: 'get'
  })
}

// 新增图书借阅
export function addBookborrow(data) {
  return request({
    url: '/xinhu-person/bookborrow',
    method: 'post',
    data: data
  })
}

// 修改图书借阅
export function updateBookborrow(data) {
  return request({
    url: '/xinhu-person/bookborrow',
    method: 'put',
    data: data
  })
}

// 删除图书借阅
export function delBookborrow(id) {
  return request({
    url: '/xinhu-person/bookborrow/' + id,
    method: 'delete'
  })
}
