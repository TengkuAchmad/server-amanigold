module.exports = app => {
    const transaction = require("../controller/transaction.controller");

    var router = require("express").Router();

    router.post("/", transaction.create);

    router.get("/", transaction.findAll);

    router.get("/:id", transaction.findOne);

    router.put("/:id", transaction.update);

    router.delete("/:id", transaction.delete);

    router.delete("/", transaction.deleteAll);

    app.use('/transaction', router);
};