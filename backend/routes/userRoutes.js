const express = require('express');
const { registerUser,authUser,updateUserProfile, isUserAuthenticated } = require('../controllers/userControllers');
const {protect} = require("../middlewares/authMiddlware")

const router = express.Router();

router.route('/').post(registerUser)
router.route('/login').post(authUser)
router.route('/profile').post(protect,updateUserProfile)
router.route('/:token').get(isUserAuthenticated)


module.exports = router
