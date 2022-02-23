const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE METHOD/////////////////
// only admin can create a new product
router.post("/", verifyTokenAndAdmin ,async (req,res)=>{
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    } catch(err) {
        res.status(500).json(err);
    }
})

//*****************************UPDATE PRODUCTS METHOD****************************
//PUT because we are updating
//async function
router.put("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            // take everything inside of req.body and SET IT AGAIN
            $set :req.body
        },
        {new:true}
        );
        res.status(200).json(updatedProduct);
    } catch(err){
        res.status(500).json(err);
    }
    
});

//*****************************DELETE PRODUCTS METHOD***********************************

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    //function here
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }

});

//*****************************GET PRODUCT METHOD***********************************
//everyone can get products
//add another endpoint
router.get("/find/:id",  async (req, res) => {
    //function here
    try{
        const products = await Product.findById(req.params.id);
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err);
    }

});


//*****************************GET ALL PRODUCTS METHOD***********************************
router.get("/", async (req, res) => {
    //get products by created at 5 
    const qNew = req.query.new;
    const qCategory = req.query.category;
    //fetch products by category
    try{   
        let products;
        
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if (qCategory){
            products = await Product.find({
                categories:{
                    $in: [qCategory],
                },
            });
        } else {
            //if no query all products in db
            products = await Product.find();
        }
        res.status(200).json(products);

    } catch(err) {
        res.status(500).json(err);
    }

});


module.exports = router;