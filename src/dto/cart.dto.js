import crypto from "crypto";
import argsUtil from "../utils/args.util.js";

const { persistence } = argsUtil;

class CartDTO {
    constructor(cart) {
        persistence !== "mongo" &&
            (this._id = crypto.randomBytes(12).toString("hex"));
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: item.product._id || item.product,
            quantity: item.quantity,
            title: item.product.title,
            price: item.product.price,
            total: item.product.price * item.quantity
        }));
        this.total = this.calculateTotal();
    }
    
    calculateTotal() {
        return this.products.reduce((sum, item) => sum + item.total, 0);
    }
}

export default CartDTO;
