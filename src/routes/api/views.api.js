import { Router } from 'express';
import productsModel from '../../data/mongo/models/product.model.js';
import cartsModel from '../../data/mongo/models/cart.model.js';

const router = Router();

router.get('/', async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('home', {products})
})


router.get('/realtimeproducts', async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('rtProducts', {products});
})

router.get('/cart:cid', async(req,res)=>{
    let cid = req.params.cid;
    let cart = await cartsModel.find({_id: cid}).populate({path: 'productList._id', model: productsModel}).lean();
    res.status(200).render('cart', {cart});
})

router.get('/cart', async(req,res)=>{
    let cart = await cartsModel.find().populate({path: 'productList._id', model: productsModel}).lean(); 
    res.status(200).render('cart', {cart});
})


export default router;