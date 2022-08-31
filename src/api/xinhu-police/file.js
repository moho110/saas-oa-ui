import request from '@/utils/request'

// 查询上传文件记录列表
export function listFile(query) {
  return request({
    url: '/xinhu-police/file/list',
    method: 'get',
    params: query
  })
}

// 查询上传文件记录详细
export function getFile(id) {
  return request({
    url: '/xinhu-police/file/' + id,
    method: 'get'
  })
}

// 新增上传文件记录
export function addFile(data) {
  return request({
    url: '/xinhu-police/file',
    method: 'post',
    data: data
  })
}

// 修改上传文件记录
export function updateFile(data) {
  return request({
    url: '/xinhu-police/file',
    method: 'put',
    data: data
  })
}

// 删除上传文件记录
export function delFile(id) {
  return request({
    url: '/xinhu-police/file/' + id,
    method: 'delete'
  })
}
