module.exports = (sequelize, Sequelize) => {

    const Card = sequelize.define("Card", {
        ID_Card: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        Amount_Card: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        Type_Card: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        Status_Card: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });

    const Customer = require('./customer.model')(sequelize, Sequelize);
    Card.belongsTo(Customer, { foreignKey: 'ID_Customer' });
    Customer.hasMany(Card, { foreignKey: 'ID_Customer' });

    return Card;
}