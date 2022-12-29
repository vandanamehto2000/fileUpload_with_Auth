const express = require("express");
const upload = require("../utils/fileUpload");
const router = express.Router();
const { isAuthenticated, isSeller } = require("../middlewares/auth");
const Product = require("../models/productModel");

router.post("/create", isAuthenticated, isSeller, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log("coming an err", err);
            return res.status(500).send(err)
        }
        const { name, price } = req.body;
        if (!name || !price || !req.file) {
            return res.status(400).json({ err: "we require all 3" })
        }
        if (Number.isNaN(price)) {
            return res.status(400).json({ err: "price should be on number" })
        }

        let productDetails = {
            name, price, content: req.file.path
        }
        return res.status(200).json({
            status: "ok",
            productDetails
        })
    })
})



router.get("/get/all", isAuthenticated, async (_req, res) => {
    try {
        const products = await Product.findAll();
        let varx = products.every(product => product instanceof Product);
        console.log("All users:", JSON.stringify(varx, null, 2));
        return res.status(200).json({ Products: varx });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ err: err.message });
    }
});

module.exports = router;
