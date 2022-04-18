const { Photo } = require('./model')

module.exports = {
  async getPhotoById(id) {
    return Photo.findById(id)
  },
  async add(userId, url, albumId) {
    return await Photo.create({
      userId,
      url,
      albumId
    })
  },
  async delete(id) {
    return Photo.updateOne({ _id: id }, { isDelete: true })
  },
  async getPhotosByAlbumId(albumId, pageIndex, pageSize) {
    return Photo.find({
      albumId,
      isApproved: true,
      isDelete: false
    }).sort({
      'updated': -1
    })
  },
  async getPhotosByAlbumIdCount(albumId) {
    return Photo.count({
      albumId,
      isApproved: true,
      isDelete: false
    })
  },
  // 分页获取待审核照片列表
  async getApprovingPhotos(pageIndex, pageSize) {
    return Photo.find({
      isApproved: null,
      isDelete: false
    }).limit(pageSize).skip((pageIndex - 1) * pageSize)
  },
  // 获取待审核列表数量
  async getApprovingPhotosCount() {
    return Photo.count({
      isApproved: null,
      isDelete: false
    })
  },
  async getApprovedPhotos(pageIndex, pageSize) {
    return Photo.find({
      isApproved: true,
      isDelete: false
    }).limit(pageSize).skip((pageIndex - 1) * pageSize)
  },
  async getApprovedPhotosCount() {
    return Photo.count({
      isApproved: true,
      isDelete: false
    })
  },
  async getUnApprovedPhotos(pageIndex, pageSize) {
    return Photo.find({
      isApproved: false,
      isDelete: false
    }).limit(pageSize).skip((pageIndex - 1) * pageSize)
  },
  async getUnApprovedPhotosCount() {
    return Photo.count({
      isApproved: false,
      isDelete: false
    })
  },
  async getAll(pageIndex, pageSize) {
    return Photo.find({
      isDelete: false
    }).limit(pageSize).skip((pageIndex - 1) * pageSize)
  },
  async getAllCount() {
    return Photo.count({
      isDelete: false
    })
  },
  async approve(id, state) {
    return Photo.updateOne({ _id: id }, { isApproved: state || true }) // 未获取到状态 默认为审核操作
  }
}
