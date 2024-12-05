import UserModel from '../models/user.model.js';
import Manager from './manager.js';

const usersManager = new Manager(UserModel)

export const { create, read, readByEmail, readById, update, deleteById } = usersManager