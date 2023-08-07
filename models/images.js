
const { sequelize_instance } = require('./index');
const { DataTypes } = require('sequelize');

    const graff_images = sequelize_instance.define('graff_images', {
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
                model: 'graff_users',
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
    
module.exports = graff_images
