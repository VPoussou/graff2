const { Sequelize, DataTypes } = require('sequelize');
const sequelize_config = require('../config/db_config').db_Config;
const { sequelize } = require('./index')

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

module.exports = sequelize;

