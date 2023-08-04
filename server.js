const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const {sequelize, test_db, graff_users, graff_images } = require('./models/index');

test_db().then(() => {
    console.log('Connection to the database has been established successfully');
    return sequelize.sync();
}).then(() => {

    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    }).on('error', (error) => {
        console.error('Error starting server:', error);
    });

})


