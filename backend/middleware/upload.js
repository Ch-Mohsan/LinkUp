const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utilities/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkup_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const upload = multer({ storage });

const uploadPostImage = upload.single('image');
const uploadAvatar = upload.single('avatar');
const uploadCoverImage = upload.single('coverImage');
const uploadProfileImages = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

module.exports = {
  upload,
  uploadPostImage,
  uploadAvatar,
  uploadCoverImage,
  uploadProfileImages
}; 