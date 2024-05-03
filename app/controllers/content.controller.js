// LIBRARY IMPORT
const express           = require('express');
const AWS               = require('aws-sdk');
const multer            = require('multer');
const multerS3          = require('multer-s3');
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');

// CONSTANT IMPORT
const SPACES_URL        = process.env.SPACES_URL;
const SPACES_ACCESS_KEY = process.env.SPACES_ACCESS_KEY;
const SPACES_SECRET_KEY = process.env.SPACES_SECRET_KEY;

// ORM
const prisma            = new PrismaClient();

// FUNCTION IMPORT
const spacesEndpoint = new AWS.Endpoint(SPACES_URL);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: SPACES_ACCESS_KEY,
    secretAccessKey: SPACES_SECRET_KEY,
});

const uploadFile = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'amanigoldbuckets',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, 'content/' + uuidv4() + '-' + file.originalname);
        }
    })
});

// CONTROLLER
exports.upload = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "File tidak ditemukan!"});
        }

        uploadFile.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: "An error occured" + err });
            }

            const savedFile = await prisma.contentData.create({
                data: {
                    UUID_CD: uuidv4(),
                    Url_CD: req.file.location,
                    Title_CD: req.body.title,
                    Description_CD: req.body.description,
                    isActive_CD: true
                }
            })

            return res.status(200).json({ message: "File berhasil diunggah", file: savedFile});
        });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan dalam menangani pengunggahan file", error: error });
    }
}
