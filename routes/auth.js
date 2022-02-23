const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    
    const newUser = new User({ 
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    //this is a promise which is a asnycronous function
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    


});

//LOGIN

router.post("/login", async (req, res) => {
    try{

        const user = await User.findOne({username: req.body.username }); 
        !user && res.status(401).json("Wrong credentials");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        //after login process if everything is ok.. create json web token
    
        OriginalPassword !==req.body.password && 
            res.status(401).json("Wrong credentials!");
        
        const accessToken = jwt.sign({
            
            //also gonna store if (ISADMIN) inside of token
            //basically you can pass any property in here that becuase after when we try to dilate user we are going to check
            // if the USERID INSIDE the json webtoken if it equals the id number "62167d3886a557012216b33d" that means this user belongs to our client means they can update/delete ,
            // if is admin they can do any crude operations such as deleting other users
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            {expiresIn: "3d"} //THE TOKEN EXPIRES IN 3DAY CANT USE THE ACCESS TOKEN AGAIN WILL HAVE TO LOGIN AGAIN
        );    

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router