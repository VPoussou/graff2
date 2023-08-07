const { Sequelize } = require('sequelize');
const sequelize_config = require('../config/db_config').db_Config;
const sequelize_instance = new Sequelize(sequelize_config.database, sequelize_config.username, sequelize_config.password, {
    host: sequelize_config.options.host,
    dialect: sequelize_config.options.dialect,
    dialectOptions: {
        charset: sequelize_config.options.charset,
        collate: sequelize_config.options.collate
    },
    logging: console.log,
    port: sequelize_config.options.port
});


async function test_db(){
    return sequelize_instance.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
}


function db_init() {
    const graff_users = require('./users');
    const graff_images = require('./images');
    require('./users');
    require('./images');

    graff_users.hasMany(graff_images, {
        foreignKey: 'graff_userid',
        as: 'images_per_user'
    });

    graff_images.belongsTo(graff_users, {
        foreignKey: 'graff_userid',
        as: 'user_per_images'
    })
test_db()
.then(async () => {
    try {
        await sequelize_instance.sync();
        console.log('Database synchronized successfully')
    } catch (error) {
        console.error('An error occurred while synchronizing the database')
    }
    sequelize_instance .query(`DESCRIBE graff_users;`).then(([results, metadata]) => {
        console.log('Table structure:', results);
        }).catch(error => {
        console.error('Error describing table:', error);
        });
})
}
module.exports = {
    db_init,
    sequelize_instance 
}
