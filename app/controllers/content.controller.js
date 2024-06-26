// LIBRARY IMPORT
const { PutObjectCommand, DeleteObjectCommand, ListObjectsCommand,S3Client } = require("@aws-sdk/client-s3")
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');

// CONSTANT IMPORT
const { SPACES_URL, SPACES_ACCESS_KEY, SPACES_SECRET_KEY, SPACES_PUBLIC }  = process.env

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
        const { title, description } = req.body

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const secureName = `${timestamp}-${randomString}.${file.originalname.split('.').pop()}`;
        
        
        const params = {
            Bucket: 'amanigoldbuckets',
            Key: `content/${secureName}`,
            Body: file.buffer,
            ACL: 'public-read'
        }

        await s3Client.send(new PutObjectCommand(params))

        const url  = `${SPACES_PUBLIC}/${params.Key}`

        await prisma.contentData.create({
            data: {
                UUID_CD: uuidv4(),
                Url_CD: url,
                Filename_CD: secureName,
                Title_CD: title,
                Description_CD: description,
                isActive_CD: true
            }
        })

        return res.json({ message: 'File uploaded successfully', url })
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.findAll = async (req, res) => {
    try {
        const contentData = await prisma.contentData.findMany()
        return res.json(contentData)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.findOne = async (req, res) => {
    try {
        const { uuid } = req.params
        const contentData = await prisma.contentData.findUnique({
            where: {
                UUID_CD: uuid
            }
        })
        return res.json(contentData)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.deleteAll =     async (req, res) => {
    try {
        const listParams = {
            Bucket: 'amanigoldbuckets'
        }

        const data = await s3Client.send(new ListObjectsCommand(listParams))

        const files = data.Contents.map(file => file.Key)

        await Promise.all(files.map(async file => {
            const params = {
                Bucket: 'amanigoldbuckets',
                Key: file
            }

            await s3Client.send(new DeleteObjectCommand(params))
        }))

        await prisma.contentData.deleteMany()
        
        return res.status(200).json({ message: "All files deleted successfully" })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.deleteOne = async (req, res) => {
    try {
        const { uuid } = req.params

        const fileData = await prisma.contentData.findUnique({
            where:{
                UUID_CD: uuid
            }
        })

        if (!fileData) {
            return res.status(404).json({ error: 'File not found' })
        }

        const filename = fileData.Filename_CD

        const params = {
            Bucket: "amanigoldbuckets",
            Key: `content/${filename}`
        }

        await s3Client.send(new DeleteObjectCommand(params))

        await prisma.contentData.delete({
            where:{
                UUID_CD: uuid
            }
        })

        return res.json({ message: 'File deleted successfully' })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}