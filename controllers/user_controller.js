const graff_users = require('../models/users');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({error: 'Tous les champs sont obligatoires'});
        }

    const existingUser = await graff_users.findOne({ where: { email }});
    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await graff_users.create({
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({ message: 'Utilisateur enregistré'});
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error'});
}
}

exports.login = (req, res) => {

}