import { Router } from 'express';
import ProductModel from '../../data/mongo/models/product.model.js';
import CartModel from '../../data/mongo/models/cart.model.js';

const router = Router();

router.get('/', async(req, res)=>{
    let products = await ProductModel.find().lean();
    res.status(200).render('home', {products})
})


router.get('/realtimeproducts', async(req, res)=>{
    let products = await ProductModel.find().lean();
    res.status(200).render('rtProducts', {products});
})

router.get('/cart:cid', async(req,res)=>{
    let cid = req.params.cid;
    let cart = await CartModel.find({_id: cid}).populate({path: 'productList._id', model: ProductModel}).lean();
    res.status(200).render('cart', {cart});
})

router.get('/cart', async(req,res)=>{
    let cart = await CartModel.find().populate({path: 'productList._id', model: ProductModel}).lean(); 
    res.status(200).render('cart', {cart});
})


export default router;