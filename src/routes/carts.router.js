import { Router } from "express";
import CartController from "../dao/cart.controller.js";
import ProductController from "../dao/product.Controller.js";


const router = Router();
const cartController = new CartController();
const productController = new ProductController();

router.get('/:cid', async(req, res) =>{
    try{
        const cartId = parseInt(req.params.cid);
        const cart = await cartController.get({ _id: cartId });
        res.status(200).send({error:null, data: cart});
    }
    catch(err){
        res.status(500).send({error: "Cart not found"});
}
});

router.post('/', async (req, res) => {
    try{
        const createCart = await cartController.add({products: []});
        res.status(200).send({error:null, data: createCart});
    }
    catch(err){
        res.status(500).send({error: "Error showing cart"});
    }
});


router.post('/:cid/product/:pid ', async(req, res) => {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        try {
            const product = await productController.get({ _id: productId });
            if (!product) {
                return res.status(404).send({ error: 'Producto no encontrado', data: null });
            }
    
            const updatedCart = await cartController.addProduct(cartId, productId);
            if (!updatedCart) {
                return res.status(404).send({ error: 'Carrito no encontrado', data: null });
            }    
            res.status(200).json({ error: null, data: updatedCart });
        }
        catch (error) {
            res.status(500).send({ error: error.message, data: null });
        }});
        
        
        router.delete('/:cid/products/:pid', async (req, res) => {
            const { cid, pid } = req.params;
            try {
                const cart = await controller.getOne({ _id: cid });
                const productIndex = cart.products.findIndex(p => p.product == pid);
                if (productIndex !== -1) {
                    cart.products.splice(productIndex, 1);
                    await cart.save();
                    res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
                } else {
                    res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
                }
            } catch (err) {
                res.status(500).json({ status: 'error', message: err.message });
            }
        });
    
        router.put('/:cid/products/:pid', async (req, res) => {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            try {
                const cart = await controller.getOne({ _id: cid });
                if (!cart) {
                    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
                }
                const product = cart.products.find(p => p.product == pid);
                if (product) {
                    product.quantity = quantity;
                    await cart.save();
                    res.status(200).json({ status: 'success', message: 'Cantidad actualizada' });
                } else {
                    res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
                }
            } catch (err) {
                res.status(500).json({ status: 'error', message: err.message });
            }
        });
    
        router.delete('/:cid', async (req, res) => {
            const { cid } = req.params;
            try {
                await controller.deleteOne({ _id: cid });
                res.status(200).json({ status: 'success', message: 'Carrito eliminado' });
            } catch (err) {
                res.status(500).json({ status: 'error', message: err.message });
            }
        });
        
    
    router.put('/:cid', async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body;
        try {
            const cart = await controller.getOne({ _id: cid });
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            }
            cart.products = products;
            await cart.save();
            res.status(200).json({ status: 'success', payload: cart });
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    });

export default router;