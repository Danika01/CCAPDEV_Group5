const Schema = require('src/model/');

const newUser = async (req, res) => {
    const {user, pass} = req.body;
    if (!user || !pass) return res.status(400).json({'message': 'Username and password required.'});

    const duplicate = await Schema.User().findOne({username: user}).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        // User creation
        const result = await User.create({
            "username" : user,
            "password" : pass,
            "role" : 1
        });

        console.log(result);
        res.status(201).json({'success': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({'mesage': err.mesage});
    }
}

module.exports = {newUser};