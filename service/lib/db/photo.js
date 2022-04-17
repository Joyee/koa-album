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
}
