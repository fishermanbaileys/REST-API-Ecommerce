const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1]; //[1] means are second element which will be our token 
        //verifying the token
        jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
            //if problem return error but if all GOOD its going to return data
            if(err) res.status(403).json("Invalid Token /expired or wrong token/");
            //if all good assign user to request
            req.user = user;
            next();
            //going to leave this function then go to the router /user.js/
        })
    }else{
        //if there is no auth token throw an error
        //401 not authenticated
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res, () => {
        //if user id === params id or its an admin you can continue route function
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("Prohibited activity verifyTokenAndAuthorization")
        }
    });
}

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res, () => {
        //if user id === params id or its an admin you can continue route function
        if(req.user.isAdmin){
            //if admin continue router function
            next();
        } else {
            res.status(403).json("Prohibited activity verifyTokenAndAuthorization /USER DOES NOT HAVE PERMISSIONS TO DO THIS/ ")
        }
    });
}
//exporting functions
module.exports = {
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};