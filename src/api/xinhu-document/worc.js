import request from '@/utils/request'

// 查询文档分区列表
export function listWorc(query) {
  return request({
    url: '/xinhu-document/worc/list',
    method: 'get',
    params: query
  })
}

// 查询文档分区详细
export function getWorc(id) {
  return request({
    url: '/xinhu-document/worc/' + id,
    method: 'get'
  })
}

// 新增文档分区
export function addWorc(data) {
  return request({
    url: '/xinhu-document/worc',
    method: 'post',
    data: data
  })
}

// 修改文档分区
export function updateWorc(data) {
  return request({
    url: '/xinhu-document/worc',
    method: 'put',
    data: data
  })
}

// 删除文档分区
export function delWorc(id) {
  return request({
    url: '/xinhu-document/worc/' + id,
    method: 'delete'
  })
}
