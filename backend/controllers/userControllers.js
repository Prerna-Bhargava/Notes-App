const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../modals/userModal')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })
};

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, pic } = req.body;
    const userExists = await User.findOne({ email });   //If user given email exists then throw error

    if (userExists) {
        res.status(400)
        throw new Error("User Already Exits");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    })

    if (user) {  //if user succesfully created
        res.status(201)

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)

        });
    }
    else {
        res.status(400);
        throw new Error('Error Occured! ')
    }



});

const authUser = asyncHandler(async (req, res) => {

    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)

        });

    } else {
        res.status(400);
        throw new Error('Invalid Email or Password! ')
    }



});
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.pic = req.body.pic || user.pic;
        if (req.body.password) {
            user.password = req.body.password;

        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            token: generateToken(updatedUser._id),
        })

    }
    else{
        res.json(404);
        throw new Error("User not Found");
    }

})

module.exports = { registerUser, authUser, updateUserProfile }