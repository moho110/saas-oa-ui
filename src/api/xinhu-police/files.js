import request from '@/utils/request'

// 查询文件记录下载和预览列表
export function listFiles(query) {
  return request({
    url: '/xinhu-police/files/list',
    method: 'get',
    params: query
  })
}

// 查询文件记录下载和预览详细
export function getFiles(id) {
  return request({
    url: '/xinhu-police/files/' + id,
    method: 'get'
  })
}

// 新增文件记录下载和预览
export function addFiles(data) {
  return request({
    url: '/xinhu-police/files',
    method: 'post',
    data: data
  })
}

// 修改文件记录下载和预览
export function updateFiles(data) {
  return request({
    url: '/xinhu-police/files',
    method: 'put',
    data: data
  })
}

// 删除文件记录下载和预览
export function delFiles(id) {
  return request({
    url: '/xinhu-police/files/' + id,
    method: 'delete'
  })
}
