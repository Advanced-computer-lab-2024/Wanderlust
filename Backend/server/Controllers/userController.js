const userModel = require("../Models/user");

const signUp = async (req, res) => {
    const { username, email, password ,mobileNumber, role} = req.body;
    if(role === "tourist"){
        termsAccepted = true;
    }
    else{
        termsAccepted = false;
    }
    console.log(username, email, password, mobileNumber, role, termsAccepted);
    try {
        const newUser = new userModel({ username, email, password,mobileNumber, role,termsAccepted});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { signUp };