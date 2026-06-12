const express = require("express");
const { 
    register, 
    login, 
    changePassword, 
    forgotPassword, 
    resetPassword, 
    deleteUser, 
    logout 
} = require("../controllers/user.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/changepassword', authMiddleware, changePassword);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post('/resetpassword/:token', resetPassword);
authRouter.delete('/deleteuser',authMiddleware, deleteUser);
authRouter.post('/logout', authMiddleware, logout);

module.exports = authRouter;