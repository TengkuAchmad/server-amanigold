// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');

// CONSTANT IMPORT
const { JWT_SECRET }    = process.env;

// ORM
const prisma            = new PrismaClient();

exports.create = async (req, res) => {
    try {
        if (!req.body.user ||!req.body.seri || !req.body.weight || !req.body.form || !req.body.fineness) {
            return res.status(400).send({
                message: "Invalid request on body"
            })
        }

       await prisma.cardData.create({
            data: {
                UUID_CD : uuidv4(),
                UUID_UA : req.body.user,
                Seri_CD : req.body.seri,
                Weight_CD : req.body.weight,
                Form_CD : req.body.form,
                Fineness_CD : req.body.fineness
            }
        })

        // PREVIOUS DATA USER
        const previousUserData = await prisma.userData.findUnique({
            where: {
                UUID_UA: req.body.user
            }
        });

        const newAmountGold = previousUserData.Gold_UD + req.body.weight;

        const goldPrice = await prisma.goldData.findFirst({
            orderBy: {
                createdAt: "desc"
            }
        });

        const newAmountBalance = previousUserData.Balance_UD + (newAmountGold * goldPrice.Sell_GD);

        const updateUser = await prisma.userData.update({
            where: {
                UUID_UA: req.body.user
            },
            data: {
                Gold_UD: newAmountGold,
                Balance_UD: newAmountBalance
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
        const data = await prisma.cardData.findMany({});
        
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

exports.deleteAll = async (req, res) => {
    try {
        await prisma.cardData.deleteMany({});

        return res.status(200).send({message: "Cards deleted successfully"})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.findUser = async (req, res) => {
    try {
        const { uuid } = req.params

        const userData = await prisma.userAccount.findUnique({
            where: {
                UUID_UA: uuid
            },
            select : {
                Name_UA: true,
            }
        })

        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
} 