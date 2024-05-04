// LIBRARY IMPORT
const AWS       = require('aws-sdk')
const multer    = require('multer')
const upload    = multer()

// CONSTANT IMPORT
const { SPACES_URL, SPACES_ACCESS_KEY, SPACES_SECRET_KEY }  = process.env

// AWS CONFIGURATION
const spacesEndpoint    = new AWS.Endpoint(SPACES_URL)
const s3                = new AWS.S3({ endpoint: spacesEndpoint, accessKeyId: SPACES_ACCESS_KEY, secretAccessKey: SPACES_SECRET_KEY })

exports.upload = async (req, res) => {
    try {

        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.files[0]

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const secureName = `${timestamp}-${randomString}.${file.originalname.split('.').pop()}`;
        
        
        const params = {
            Bucket: 'content',
            Key: secureName,
            Body: file.buffer,
            ACL: 'public-read'
        }
        
        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to upload file' + err });
            }

            return res.json({ url: data.Location})
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}