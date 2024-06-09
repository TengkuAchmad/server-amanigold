// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');
const jwt               = require('jsonwebtoken');
const argon2            = require('argon2');
const { createKindeClient } = require("@kinde-oss/kinde-auth-nextjs/server")

// CONSTANT IMPORT
const { JWT_SECRET, KINDE_CLIENT_ID, KINDE_CLIENT_SECRET, KINDE_ISSUER_URL, KINDE_SITE_URL }    = process.env;

// ORM
const prisma            = new PrismaClient();

// KINDE CLIENT
const kindeClient = createKindeClient({
  client_id: KINDE_CLIENT_ID,
  client_secret: KINDE_CLIENT_SECRET,
  issuer_url : KINDE_ISSUER_URL,
  redirect_url: `${KINDE_SITE_URL}/user-management/callback`
});


// FUNCTION IMPORT
exports.googleLogin = async (req, res) => {
  try {
    const authUrl = kindeClient.getGoogleLoginUrl();
    res.redirect(authUrl);

  } catch (error) {
    res.status(500).send({ message: "An error occurred : " + error.message });
  }
}

exports.facebookLogin = async (req, res) => {
  try {
    const authUrl = kindeClient.getFacebookLoginUrl();
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).send({ message: "An error occurred : " + error.message });
  }
}

exports.callback = async (req, res) => {
  try {
    const tokenSet = await kindeClient.callback(req);
    const user = await kindeClient.getUser(tokenSet.access_token);

    let existingUser = await prisma.userAccount.findUnique({
      where: { Email_UA: user.email }
    });

    if (!existingUser) {
      existingUser = await prisma.userAccount.create({
        data: {
          UUID_UA: uuidv4(),
          Email_UA: user.email,
          Name_UA: user.name,
          Photo_UA: user.picture,
          Password_UA: "",
        }
      });

      await prisma.userData.create({
        data: {
          UUID_UA: uuidv4(),
          UUID_UA: existingUser.UUID_UA,
        }
      });
    }

    const accessToken = jwt.sign({ userID: existingUser.UUID_UA}, JWT_SECRET, { expiresIn: '1d'});

    res.status(200).json({success:true, accessToken})
  } catch (error) {
    res.status(500).send({ message: "An error occurred : " + error.message });
  }
}


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


exports.findOne = async(req, res) => {
    try {
        const id = req.locals.user

        const responseData = await prisma.userAccount.findUnique({
            where : {
                UUID_UA: id,
                isUser_UA: true,
                isAdmin_UA: false,
                isSuperAdmin_UA: false,
            },
            select : {
                UUID_UA: true,
                Name_UA: true,
                Email_UA: true,
                Phone_UA: true,
                Photo_UA: true,
                UserData: true,
            }
        });

        return res.status(200).json(responseData);

    } catch (error){
        return res.status(500).json({error: "An error occured" + error});
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
                Phone_UA: req.body.phone,
                Photo_UA: "default"
            }
        });

        await prisma.userData.create({
            data: {
                UUID_UD: uuidv4(),
                UUID_UA: uuid,
            }
        })

        return res.status(201).send({
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }

}

exports.update = async (req, res) => {
    try {
        const {uuid} = req.params;

        const user = await prisma.userAccount.findUnique({
            where: {
                UUID_UA: uuid
            }
        })

        if (user) {
            const updateData = Object.keys(req.body).reduce((acc, key) => {
                acc[key] = req.body[key];
                return acc;
            }, {});

            await prisma.userAccount.update({
                where: {
                    UUID_UA: uuid
                },
                data: updateData
            })

            return res.status(200).json({message: "User updated successfully"});
        } else {
            return res.status(404).json({error: "User not found"});
        }
        
    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }
}


exports.findAll = async (req, res) => {
    try {
        const responseDatas = await prisma.userAccount.findMany({
            where: {
                isUser_UA: true,
                isAdmin_UA: false,
            },
            select: {
                UUID_UA: true,
                Email_UA: true,
                Name_UA: true,
                Phone_UA: true,
                Photo_UA: true,
                UserData: true,
            }
        });

        return res.status(200).json(responseDatas);

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }
}

exports.deleteOne = async (req, res) => {
    try {
        const {uuid} = req.params;

        await prisma.userData.delete({
            where: {
                UUID_UA: uuid
            }
        })

        const availableCard = await prisma.cardData.findFirst({
            where: {
                UUID_UA: uuid
            }
        })

        if (availableCard) {
            await prisma.cardData.delete({
                where: {
                    UUID_UA: uuid
                }
            })
        }

        await prisma.userAccount.delete({
            where: {
                UUID_UA: uuid
            }
        })

        return res.json({ message: "User deleted successfully" });
    } catch (error){
        return res.status(500).json({ error: "An error occured" + error });
    }
}
exports.deleteAll = async(req, res) => {
    try {
        await prisma.userData.deleteMany({});

        await prisma.cardData.deleteMany({});

        await prisma.userAccount.deleteMany({});

        return res.status(200).json({message : "All user account successfully deleted"});
    
    } catch (error) {
        return res.status(500).json({error : "An error occured" + error});
    }
}