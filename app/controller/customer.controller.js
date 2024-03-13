const { v4: uuidv4 } = require('uuid');
const db        = require('../models');
const Customer  = db.Customer;
const Op        = db.Sequelize.Op;

// INSERT
exports.create = (req, res) => {

    // VALIDATING REQUEST
    if(!req.body.email){
        res.status(400).send({
            message: "Please input email"
        });
        return;
    };

    // CREATE FORM
    const customer = {
        ID_Customer: uuidv4(),
        Name_Customer: req.body.name,
        Email_Customer: req.body.email,
        No_Customer: req.body.no
    };

    // SAVE
    Customer.create(customer)
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
    const email = req.query.email;
    var condition = email? { email: { [Op.like] : `${email}` } } : null;

    Customer.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Terjadi kesalahan saat mengambil data pelanggan."
            });
        });
};


// GET DATA WITH ID
exports.findOne = (req, res) => {
    const id    = req.params.id

    Customer.findbyPk(id)
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

    Customer.update(req.body, {
        where: {ID_Customer : id}
    })
    .then(num => {
        if (num == 1){
            res.send({
                message: "Data customer berhasil diupdate."
            });
        } else {
            res.status(400).send({
                message: `Data Customer (${id}) gagal diupdate.`
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

    Customer.destroy({
        where: {ID_Customer : id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Data customer berhasil dihapus."
            });
        } else {
            res.send({
                message: `Data Customer (${id}) gagal dihapus.`
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
    Customer.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} data customer berhasil dihapus.`});
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message
        });
    });
};

