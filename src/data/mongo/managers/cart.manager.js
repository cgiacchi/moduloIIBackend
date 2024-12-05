import CartModel from '../models/cart.model.js'
import Manager from './manager.js'

const cartsManager = new Manager(CartModel);
export const { create, readAllPopulated, readById, readByIdPopulated, update, deleteById} = cartsManager;