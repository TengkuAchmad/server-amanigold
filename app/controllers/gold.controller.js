// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');
const jwt               = require('jsonwebtoken');
const argon2            = require('argon2');
const axios             = require('axios');

// ORM
const prisma            = new PrismaClient();

// GOLD DATA
const GOLD_URL          = "https://logam-mulia-api.vercel.app/prices/hargaemas-com";

exports.fetchDataGold = async() => {
    try {
        const response = await axios.get(GOLD_URL);
        const { data, meta } = response.data;
        
        const { sell, buy, type} = data[0];
        
        return response.status(200).json(response.data);

    } catch (error) {
        return response.status(500).json({ error: error.message })
    }
}


exports.findAll = async(req, res) => {
    try {
        const data = await prisma.goldData.findMany({
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