const graff_users = require('../models/users');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { graff_username, graff_firstname, graff_lastname, graff_password, graff_email } = req.body;
        if (!graff_username || !graff_password || !graff_email) {
            return res.status(400).json({error: 'Tous les champs sont obligatoires'});
        }

    const existingUser = await graff_users.findOne({ where: { graff_email }});
    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(graff_password, salt)

    const newUser = await graff_users.create({
        graff_username,
        graff_firstname,
        graff_lastname,
        graff_email,
        graff_password: hashedPassword
    });

    res.status(201).json({ message: 'Utilisateur enregistré'});
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error'});
}
}

exports.login = (req, res) => {

}