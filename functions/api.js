// LIBRARY IMPORT
const express           = require('express');
const serverless        = require('serverless-http');
const {PrismaClient}    = require("@prisma/client");
const bodyParser        = require('body-parser');
const cors              = require('cors');
const compression       = require('compression');
const cookieParser      = require('cookie-parser');
const multer            = require('multer');

// APP CONFIG
const app               = express();
const upload            = multer()

app.use(cors({ origin:true, credentials:true }));

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(compression())

app.use(upload.any())

// APP ROUTES
const api_routes        = require('../app/routes/api.routes')
const user_routes       = require('../app/routes/user.routes')
const content_routes    = require('../app/routes/content.routes')
const gold_routes       = require('../app/routes/gold.routes')
const card_routes       = require('../app/routes/card.routes')

const endpoints = [ api_routes, user_routes, content_routes, gold_routes, card_routes ]

app.use('/.netlify/functions/api', endpoints)

module.exports.handler = serverless(app)