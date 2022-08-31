import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listAdmin(query) {
  return request({
    url: '/xinhu-person/admin/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getAdmin(id) {
  return request({
    url: '/xinhu-person/admin/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增用户
export function addAdmin(data) {
  return request({
    url: '/xinhu-person/admin',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateAdmin(data) {
  return request({
    url: '/xinhu-person/admin',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delAdmin(id) {
  return request({
    url: '/xinhu-person/admin/' + id,
    method: 'delete'
  })
}

// 获取下拉列表
export function getUserList() {
  return request({
    url: '/person/admin/userList',
    method: 'get'
  })
}

// 获取下拉列表
export function getBookList() {
  return request({
    url: '/person/book/list',
    method: 'get'
  })
}
