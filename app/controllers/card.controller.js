// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');

// CONSTANT IMPORT
const { JWT_SECRET }    = process.env;

// ORM
const prisma            = new PrismaClient();

exports.create = async (req, res) => {
    try {
        if (!req.body.seri || !req.body.weight || !req.body.weight || !req.body.form || !req.body.fineness) {
            return res.status(400).send({
                message: "Invalid request on body"
            })
        }

       await prisma.cardData.create({
            data: {
                UUID_CD : uuidv4(),
                UUID_UA : req.locals.user,
                Seri_CD : req.body.seri,
                Weight_CD : req.body.weight,
                Form_CD : req.body.form,
                Fineness_CD : req.body.fineness
            }
        })

        return res.status(201).send({
            message: "Card created successfully"
        })
    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }
}

exports.findAll = async (req, res) => {
    try {
        const data = await prisma.cardData.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            take: 1
        });
        
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.findOne = async (req, res) => {
    try {
        const { uuid } = req.params
        const cardData = await prisma.cardData.findUnique({
            where: {
                UUID_CD: uuid
            }
        })
        return res.json(cardData)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}