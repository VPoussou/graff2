const Sequelize = require('sequelize');
const sequelize_config = require('../config/db_config').db_Config;
const sequelize = new Sequelize(sequelize_config.database, sequelize_config.username, sequelize_config.password, {
    host: sequelize_config.host,
    port: sequelize_config.port,
    dialect: sequelize_config.dialect
});

const graff_users = require('./users')
const graff_images = require('./images')


function test_db(){
    return sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
}

module.exports = {
    sequelize,
     test_db,
     graff_users,
     graff_images
    };
