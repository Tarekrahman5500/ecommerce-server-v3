import express from 'express'
import User from "../models/user";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import jwt from 'jsonwebtoken'
import ErrorResponse from "../public/javascripts/errorResponse";

const router = express.Router();
router.post("/register", async (req, res, next) => {

    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString(),
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (err) {
        next(err);
    }
});

//LOGIN

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) return next(new ErrorResponse('Wrong User Name', 401))

        const hashedPassword = AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(Utf8);

        const inputPassword = req.body.password;

       if (originalPassword !== inputPassword ) return next(new ErrorResponse('Wrong Password', 401))

           const accessToken = jwt.sign(
           {
               id: user._id,
               isAdmin: user.isAdmin,
           },
           process.env.JWT_SEC,
               {expiresIn:"3d"}
           );

         const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});

    } catch (err) {
        next(err);
    }

});
module.exports = router;