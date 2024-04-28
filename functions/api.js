// LIBRARY IMPORT
const express           = require('express');
const serverless        = require('serverless-http');
const {PrismaClient}    = require("@prisma/client");
const bodyParser        = require('body-parser');
const cors              = require('cors');
const compression       = require('compression');
const cookieParser      = require('cookie-parser');

// APP CONFIG
const app               = express();

app.use(cors({ origin:true, credentials:true }));

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(compression())

// APP ROUTES
const api_routes = require('../app/routes/api.routes')

const endpoints = [ api_routes ]

app.use('/.netlify/functions/api', endpoints)

module.exports.handler = serverless(app)