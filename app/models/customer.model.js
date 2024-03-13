module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("Customer", {
        ID_Customer: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        Name_Customer: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Email_Customer: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        No_Customer: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }); 

    return Customer;
};
