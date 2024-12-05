import ProductModel from '../models/product.model.js';
import  Manager from './manager.js';

const productsManager = new Manager(ProductModel);
export const { create, readAll, readAllPopulated, readAllPaginated, readById, readByIdPopulated, update, deleteById} = productsManager;