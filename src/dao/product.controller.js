import ProductModel from "./models/product.model.js";
import config from '../config.js';


class ProductController {
    constructor() {}

    add = async (data) => {
        try {
            return await ProductModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    get = async () => {
        try {
            const products = await ProductModel.find()
                .populate({
                    path: 'category', model: config.CATEGORIES_COLLECTION, select: 'name'
                }).lean();
            return products;
        } catch (err) {
            return err.message;
        }
    }


    getOne = async (data) => {
    try {
        console.log("data:", data);
        return await ProductModel.findOne(data).lean();
    } catch (err) {
        console.error("Error al buscar el producto:", err);
        return null;
    }
    };

    getPaginated = async (pag) => {
    try {
        const page = pag || 1;
        return await ProductModel.paginate(
        {},
        { limit: 10, page: page, lean: true }
        );
    } catch (err) {
        return err.message;
    }
    };

    stats = async (limit) => {
        try {
            const stats = await ProductModel.aggregate([
                {$match: {stock:limit}},
                {$group: { _id: '$title', count: { $sum: 1 } } },
                {$sort: { count: -1 } }
            ]);
            return stats;
        } catch (err) {
            return err.message;
        }
    }


    update = async (filter, updated, options) => {
    try {
        return await ProductModel.findOneAndUpdate(filter, updated, options);
    } catch (err) {
        return err.message;
    }
    };

    delete = async (data, options) => {
    try {
        return await ProductModel.findOneAndDelete(data, options);
    } catch (err) {
        return err.message;
    }
    };
};

export default ProductController;