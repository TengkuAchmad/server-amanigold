// LIBRARY IMPORT
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3")
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');

// CONSTANT IMPORT
const { SPACES_URL, SPACES_ACCESS_KEY, SPACES_SECRET_KEY }  = process.env

// ORM
const prisma            = new PrismaClient();

const s3Client          = new S3Client({
    endpoint: SPACES_URL,
    forcePathStyle: false,
    region: 'sgp1',
    credentials: {
        accessKeyId: SPACES_ACCESS_KEY,
        secretAccessKey: SPACES_SECRET_KEY
    }
})

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
            Bucket: 'amanigoldbuckets',
            Key: `content/${secureName}`,
            Body: file.buffer,
            ACL: 'public-read'
        }

        const data = await s3Client.send(new PutObjectCommand(params))

        const url  = params.Bucket + '/' + params.Key

        await prisma.contentData.create({
            data: {
                UUID_CD: uuidv4(),
                Url_CD: url,
                Title_CD: req.body.title,
                Description_CD: req.body.description,
                isActive_CD: true
            }
        })

        return res.json({ message: 'File uploaded successfully', url })
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}