
const { sequelize_instance } = require('./index')
const { DataTypes } = require('sequelize')

const users = sequelize_instance.define('users', {
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
    graff_firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    graff_lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    graff_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    graff_password: {
        type: DataTypes.STRING,
        allowNull: false
    }}, 
    {
        timestamps: true,
        freezeTableName: true
    }
);

module.exports = users;


