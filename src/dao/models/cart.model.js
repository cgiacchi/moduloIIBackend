import mongoose from 'mongoose';
import config from '../../config.js';
import mongoosePaginate from 'mongoose-paginate-v2'


mongoose.pluralize(null);

const collection = config.CARTS_COLLECTION;

const schema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION, required: true },
        quantity: { type: Number, default: 1 },
        _id: false
    }],
    total: { type: Number, default: 0 },
});

schema.plugin(mongoosePaginate);

const CartModel = mongoose.model(collection, schema);

export default CartModel;