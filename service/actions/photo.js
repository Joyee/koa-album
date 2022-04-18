const album = require('../lib/db/album')
const { add } = require('../lib/db/album')
const photo = require('../lib/db/photo')

module.exports = {
  async delete(id) {
    await photo.delete(id)
  },
  async getPhotoById(id) {
    await photo.getPhotoById(id)
  },
  async add(userId, url, albumId) {
    await photo.add(userId, url, albumId)
  },
  async addAlbum(userId, name) {
    return add(userId, name)
  },
  async updateAlbum(id, name, user) {
    const _album = await album.findById(id)
    if (!_album) {
      throw new Error('修改的相册不存在')
    }
    if (!user.isAdmin && user.id !== _album.userId) {
      throw new Error('你没有修改此相册的权限')
    }
    return album.update(id, name)
  },
  // 删除相册 需要判断该相册下是否存在照片 如果还有照片则不允许删除
  async deleteAlbum(id) {
    const photos = await photo.getPhotosByAlbumIdCount(id)
    if (photos.length) {
      throw new Error('相册还存在照片，不允许删除')
    }
    return album.delete(id)
  },
  // 查询所有相册和对应相册中的照片数
  async getAlbums(userId, pageIndex, pageSize) {
    const albums = await album.getAlbums(userId)
    return Promise.all(albums.map(async function (item) { // 同时查询出每张照片的信息
      const id = item._id
      let ps = await photo.getPhotosByAlbumId(id, pageIndex, pageSize)
      return Object.assign({
        photoCount: ps.length,
        fm: ps[0] ? ps[0].url : null // 默认取第一张为封面
      }, item.toObject())
    }))
  },
  // 通过审核状态查询所有照片
  async getPhotosByType(type, pageIndex, pageSize) {
    let count, photos
    switch (type) {
      case 'pending': // 待审核
        [count, photos] = await Promise.all([photo.getApprovingPhotosCount(), photo.getApprovingPhotos(pageIndex, pageSize)])
        return { count, data: photos }
      case 'accepted': // 审核通过
        [count, photos] = await Promise.all([photo.getApprovedPhotosCount(), photo.getApprovedPhotos(pageIndex, pageSize)])
        return { count, data: photos }
      case 'rejected': // 审核被拒绝
      default: // 所有
        [count, photos] = await Promise.all([photo.getAllCount(), photo.getAll(pageIndex, pageSize)])
        return { count, data: photos }
    }
  },
}