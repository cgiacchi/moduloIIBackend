import dbConnect from "../utils/dbConnect.util.js";
import argsUtil from "../utils/args.util.js";

const { persistence } = argsUtil;

let dao = {};

switch (persistence) {
  case "memory":
    console.log("connected to memory system");
    const { default: ProductsManagerMemory } = await import(
      "./memory/ProductsManager.memory.js"
    );
    const { default: UsersManagerMemory } = await import(
      "./memory/UsersManager.memory.js"
    );
    const { default: CartsManagerMemory } = await import(
      "./memory/CartsManager.memory.js"
    );
    dao = {
      ProductsManager: ProductsManagerMemory,
      UsersManager: UsersManagerMemory,
      CartsManager: CartsManagerMemory,
    };
    break;
  case "fs":
    console.log("connected to file system");
    const { default: ProductsManagerFS } = await import(
      "./fs/product.manager.fs.js"
    );
    const { default: UsersManagerFS } = await import("./fs/user.manager.fs.js");
    const { default: CartsManagerFS } = await import("./fs/cart.manager.fs.js");
    dao = {
      ProductsManager: ProductsManagerFS,
      UsersManager: UsersManagerFS,
      CartsManager: CartsManagerFS,
    };
    break;
  default:
    console.log("connected to mongo database");
    dbConnect();
    const { default: ProductsManagerMongo } = await import(
      "./mongo/managers/product.manager.js"
    );
    const { default: UsersManagerMongo } = await import(
      "./mongo/managers/user.manager.js"
    );
    const { default: CartsManagerMongo } = await import(
      "./mongo/managers/cart.manager.js"
    );
    dao = {
      ProductsManager: ProductsManagerMongo,
      UsersManager: UsersManagerMongo,
      CartsManager: CartsManagerMongo,
    };
    break;
}

export default dao;