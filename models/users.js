const { Sequelize, DataTypes } = require('sequelize');
const sequelize_config = require('../config/db_config').db_Config;
const sequelize = new Sequelize(sequelize_config.database, sequelize_config.username, sequelize_config.password, {
    host: sequelize_config.host,
    port: sequelize_config.port,
    dialect: sequelize_config.dialect
});

module.exports = (sequelize, DataTypes) => {
    const graff_users = sequelize.define('graff_users', {
        graff_userid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        graff_username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }}, 
        {
            timestamps: true,
            freezeTableName: true
        }
    );

    sequelize.sync().then(() => {
        console.log('User table has been created')
    });
    return graff_users;
};
