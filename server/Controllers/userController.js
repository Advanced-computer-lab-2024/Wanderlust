const userModel = require("../Models/user");

const createUser = async (req, res) => {
    const { username, email, password ,role} = req.body;

    try {
        const newUser = new userModel({ username, email, password ,role});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createUser };