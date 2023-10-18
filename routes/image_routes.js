const express = require('express');
const router = express.Router();
const image_controller = require('../controllers/image_controller.js');

router.post('/userimg', image_controller.pyCompose);

module.exports = router;
