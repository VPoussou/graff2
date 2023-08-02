const Sequelize = require('sequelize');
const config = require('../config/db_config')
const sequelize = new Sequelize(config.db_Config)

function test_db(){
    return sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
}

module.exports = {sequelize, test_db};
