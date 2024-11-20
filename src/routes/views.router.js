import { Router } from "express";
import ProductController from "../dao/product.controller.js";
import CartController from "../dao/cart.controller.js";

const cartController = new CartController()
const productController = new ProductController()

const router = Router();


router.get('/products', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8080/api/products')
        const products = await response.json();
        console.log('products:', products)
        res.render('home', {products: products.data});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid

    try {
        console.log(pid)       
        const product = await ProductController.getOne({_id:pid});
        res.render('product', {product});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/products/paginated/:pg',  async(req, res) => {
    const pg = req.params.pag;
    const products = await ProductController.getPaginated(pag)
    console.log('Límite:', pag);
    res.status(200).render('home', { products });
});

router.get('/:cid/products', async (req, res) => {
    const cid = req.params.cid;
    try {
        const response = await fetch('http://localhost:8080/api/products')
        const products = await response.json();
        console.log('products:', products)
        res.render('home', {products: products.data, cid});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }

});

router.get('/realTimeProducts', (req,res)=> {
    res.status(200).render('realTimeProducts')
})

router.get('/realTimeProducts/paginated/:pag', (req,res)=> {
    const pg = req.params.pag
    res.status(200).render('realTimeProducts', {pag})
})

router.get('/realTimeProducts/:pid?', async (req, res)=> {
    const pid = req.params.pid;
    try {
        const product = await ProductController.getOne({_id:pid});
        console.log('pid:',pid)
        console.log(product)
        res.render('product', { product });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
})

router.get('/carts', async (req, res)=> {

    try {
        const response = await fetch('http://localhost:8080/api/carts')
        const carts = await response.json();
        res.render('carts', {carts: carts.data});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }

    })

router.get('/carts/:cid', async(req, res)=> {
    const cid = req.params.cid
    const cart = await CartController.getOne({_id: cid})
    console.log(cid)
    res.status(200).render('cart', {cart})
})


export default router;