// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');
const jwt               = require('jsonwebtoken');
const argon2            = require('argon2');

// CONSTANT IMPORT
const { JWT_SECRET }    = process.env;

// ORM
const prisma            = new PrismaClient();


// FUNCTION IMPORT
exports.auth = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                message: "Invalid request on body"
            });
        }

        const user = await prisma.userAccount.findUnique({
            where: {
                Email_UA: req.body.email
            }
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (await argon2.verify(user.Password_UA, req.body.password)) {
            const accessToken = jwt.sign({ userID: user.UUID_UA }, JWT_SECRET, { expiresIn: '1d'});

            return res.status(200).json({ success:true, accessToken })
        } else {
            return res.status(401).send({
                message: "Invalid password"
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "An error occured" + error });
    }
}

exports.signup = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.phone || !req.body.name) {
            return res.status(400).send({
                message: "Invalid request on body"
            });
        };

        const hashPassword = await argon2.hash(req.body.password);
        
        let uuid            = uuidv4();

        await prisma.userAccount.create({
            data : {
                UUID_UA: uuid,
                Email_UA: req.body.email,
                Password_UA: hashPassword,
                Name_UA: req.body.name,
                Phone_UA: req.body.phone
            }
        });

        return res.status(201).send({
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }

}

exports.deleteAll = async(req, res) => {
    try {
        await prisma.userAccount.deleteMany({});

        return res.status(200).json({message : "All user account successfully deleted"});
    
    } catch (error) {
        return res.status(500).json({error : "An error occured" + error});
    }
}