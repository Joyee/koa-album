const { Photo } = require('./model')

module.exports = {
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
