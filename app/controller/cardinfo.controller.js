const { v4: uuidv4 } = require('uuid');
const db        = require('../models');
const Card  = db.Card;
const Op        = db.Sequelize.Op;

// INSERT
exports.create = (req, res) => {

    // VALIDATING REQUEST
    if(!req.body.ID_Card){
        res.status(400).send({
            message: "Please input Invoice ID"
        });
        return;
    };

    // CREATE FORM
    const card = {
        ID_Card: uuidv4(),
        Amount_Card: req.body.amount,
        Type_Card: req.body.type,
        Status_Card: req.body.status,
        ID_Customer: req.body.id_cust
    };

    // SAVE
    Card.create(card)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
            });
        });
};


// GET ALL
exports.findAll = (req, res) => {
    const ID_Card = req.query.ID_Card;
    var condition = ID_Card? { ID_Card: { [Op.like] : `${ID_Card}` } } : null;

    Card.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Terjadi kesalahan saat mengambil data kartu."
            });
        });
};


// GET DATA WITH ID
exports.findOne = (req, res) => {
    const id    = req.params.id

    Card.findbyPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// UPDATE DATA
exports.update = (req, res) => {
    const id = req.params.id;

    Card.update(req.body, {
        where: {ID_Card : id}
    })
    .then(num => {
        if (num == 1){
            res.send({
                message: "Data kartu berhasil diupdate."
            });
        } else {
            res.status(400).send({
                message: `Data kartu (${id}) gagal diupdate.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// DELETE DATA
exports.delete  = (req, res) => {
    const id    = req.params.id;

    Card.destroy({
        where: {ID_Card : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Data kartu berhasil dihapus."
            });
        } else {
            res.send({
                message: `Data kartu (${id}) gagal dihapus.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};


// DELETE ALL DATA
exports.deleteAll = (req, res) => {
    Card.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} data kartu berhasil dihapus.`});
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message
        });
    });
};

