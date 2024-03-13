const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync({ update:true }).then(() => {
    console.log('Database synced successfully.');
  }).catch(err => {
    console.error('Error syncing database:', err);
  });

// ROUTER IMPORT
require("./app/routes/customer.routes")(app);
require("./app/routes/card.routes")(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});