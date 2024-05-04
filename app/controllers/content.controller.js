// LIBRARY IMPORT
const AWS       = require('aws-sdk')
const multer    = require('multer')
const upload    = multer()

// AWS CONFIGURATION
const spacesEndpoint    = new AWS.Endpoint('https://spaces.storage.googleapis.com')

// CONSTANT IMPORT
const { SPACES_URL, SPACES_ACCESS_KEY, SPACES_SECRET_KEY }  = process.env

const s3                = new AWS.S3({ endpoint: spacesEndpoint, accessKeyId: SPACES_ACCESS_KEY, secretAccessKey: SPACES_SECRET_KEY })

exports.upload = async (req, res) => {
    if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files[0]

    const params = {
        Bucket: SPACES_URL,
        Key: `content/content.${file.originalname.split('.').pop()}`,
        Body: file.buffer,
        ACL: 'public-read'
    }

    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        return res.json({ url: data.Location})
    })
}