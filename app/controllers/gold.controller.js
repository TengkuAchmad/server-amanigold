// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');
const jwt               = require('jsonwebtoken');
const argon2            = require('argon2');
// ORM
const prisma            = new PrismaClient();

exports.create = async(req, res) => {
    try {
        if (!req.body.sell || !req.body.buy || !req.body.type) {
            return res.status(400).json({ error: 'Missing sell or buy amount' })
        }

        const { sell, buy, type} = req.body;
        
        // CHECKING CURRENT DATA
        const lastData = await prisma.goldData.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!lastData || lastData.sell !== sell || lastData.buy !== buy) {
            await prisma.goldData.create({
                data: {
                    UUID_GD : uuidv4(),
                    Sell_GD : sell,
                    Buy_GD : buy,
                    Type_GD : type
                }
            })

            return res.status(201).json({ message: 'Gold created successfully' })
        } else {
            return res.status(400).json({message : "Data already exist"})
        }

    } catch (error) {
        return res.status(500).json({ error: error})
    }
}

exports.findAll = async(req, res) => {
    try {
        const data = await prisma.goldData.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 1
        });
        
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}