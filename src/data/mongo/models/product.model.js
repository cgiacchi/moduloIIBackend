import mongoose from 'mongoose';
import config from '../../../config.js';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);
const collection = config.PRODUCTS_COLLECTION;

const schema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        status: { type: Boolean, default: true },
        stock: { type: Number, required: true },
        category: { type: String, required: true },
        thumbnails: { type: [String], default: [] },
    });
schema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(collection, schema);
export default ProductModel;