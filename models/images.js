const { DataTypes } = require('sequelize')
const sequelize = require('./users')
const graff_users = sequelize.graff_users

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
module.exports = sequelize
