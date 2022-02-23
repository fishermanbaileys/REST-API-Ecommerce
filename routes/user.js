const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//*****************************UPDATE METHOD****************************
//PUT because we are updating
//async function
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
   //PASSWORD UPDATE
    if(req.body.password){
        //new req of password will  be this encrypted version
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            // take everything inside of req.body and SET IT AGAIN
            $set :req.body
        },
        {new:true}
        );
        res.status(200).json(updatedUser);
    } catch(err){
        res.status(500).json(err);
    }
    
});

//*****************************DELETE METHOD***********************************

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //function here
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }

});

//*****************************GET METHOD***********************************
//only admins can get user
//add another endpoint
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    //function here
    try{
        const user = await User.findById(req.params.id);
        //going to destructure other properties such
        const { password, ...others } =user._doc; //remember doc just assigns it to the correct place
        //only going to send others
        res.status(200).json(others);

    } catch(err) {
        res.status(500).json(err);
    }

});


//*****************************GET ALL USERS METHOD***********************************
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new;
    //function here
    try{                            //return 5 users        return all users
        const users = query ? await User.find().sort({ _id:-1 }).limit(5) : await User.find();
        //only going to send others                     //{ OBJECT}
        res.status(200).json(users);

    } catch(err) {
        res.status(500).json(err);
    }

});

//*****************************GET USER STATS METHOD***********************************
router.get("/stats", verifyTokenAndAdmin, async (req, res) =>{
    const date = new Date();
    //gets lastyears date
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));
    try{
        //mongoDB AGGRAGATE
        const data = await User.aggregate([
            // created at greater than last year
            {$match: {createdAt: { $gte: lastYear } } },
            {
                $project:{
                    //take my month number at the created at date ...... going to return that month
                    month: { $month: "$createdAt"},
                },
            },
            {
             $group:{
                 _id: "$month",
                 total:{ $sum: 1 },
             },
            },
        ]);
      res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;