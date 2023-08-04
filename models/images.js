const { Sequelize, DataTypes } = require('sequelize');
const sequelize_config = require('../config/db_config').db_Config;
const sequelize = new Sequelize(sequelize_config.database, sequelize_config.username, sequelize_config.password, {
    host: sequelize_config.host,
    port: sequelize_config.port,
    dialect: sequelize_config.dialect
});

module.exports = (sequelize, DataTypes) => {
    const graff_images = sequelize.define('graff_images', {
        graff_images_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        graff_images_userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: graff_users,
                key: 'graff_userid'
            }
        },
        graff_images_path: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        
    }, {
        timestamps: true,
        freezeTableName: true
    }
    );

    sequelize.sync().then(() => {
        console.log('Images table has been created')
    });
    return graff_images;
};