const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/user_routes')
const port = process.env.PORT || 3000;
const { test_db } = require('./models/index');
const sequelize = require('./models/images')

test_db()
    .then(async () => {
        console.log('Connection to the database has been established successfully');
        try {
            await sequelize.sync( { force: true });
            console.log('Database synchronized successfully')
        } catch (error) {
            console.error('An error occurred while synchronizing the database')
        }
        sequelize.query(`DESCRIBE graff_users;`).then(([results, metadata]) => {
            console.log('Table structure:', results);
          }).catch(error => {
            console.error('Error describing table:', error);
          });
    })
.then(() => {

    app.use(express.json());
    app.use(cors());
    app.use('/api', user_routes);

    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    }).on('error', (error) => {
        console.error('Error starting server:', error);
    })
})


