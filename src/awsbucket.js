import config from './config';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3'

AWS.config.update({
    accessKeyId: config.app.AWS_ACCESS_KEY,
    secretAccessKey: config.app.AWS_SECRET_KEY,
    region: config.app.AWS_REGION
})

const s3 = new AWS.S3();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
}

var upload = multer({
    storage: multerS3({
        fileFilter,
        s3: s3,
        bucket: 'productphoto',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'abhi_meta_data' });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

module.exports = upload;


