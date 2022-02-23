const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE CART METHOD/////////////////

router.post("/", verifyToken,async (req,res)=>{
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);

    } catch(err) {
        res.status(500).json(err);
    }
})

//*****************************UPDATE CART METHOD****************************
//PUT because we are updating
//async function
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            // take everything inside of req.body and SET IT AGAIN
            $set :req.body
        },
        {new:true}
        );
        res.status(200).json(updatedCart);
    } catch(err){
        res.status(500).json(err);
    }
    
});

//*****************************DELETE CART METHOD***********************************

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //function here
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }

});

//*****************************GET USER CART METHOD***********************************
//everyone can get products
//add another endpoint
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//*****************************GET ALL METHOD***********************************
router.get("/", verifyTokenAndAdmin, async (req, res) => {
   try{
        const carts = await Cart.find();
        res.status(200).json(carts);
   } catch(err) {
       res.status(500).json(err);
   }  
});

module.exports = router;