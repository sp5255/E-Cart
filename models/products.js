const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    // _id: {
    //     type: String,
    //     //required:true
    // },
    product: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isAddToCart: {
        type: Boolean,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
