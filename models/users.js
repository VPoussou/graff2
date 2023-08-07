
const { sequelize_instance } = require('./index')
const { DataTypes } = require('sequelize')

const graff_users = sequelize_instance.define('graff_users', {
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

module.exports = graff_users;


