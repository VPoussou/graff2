const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/user_routes');
const port = process.env.PORT || 3000;
const { db_init } = require('./models/index');

db_init();

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



