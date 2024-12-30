class CartsManager {
    static #carts = [];
    async create(data) {
      try {
        if (!data.user_id || !data.product_id) {
          throw new Error("INGRESE USER_ID/PRODUCT_ID");
        } else {
          CartsManager.#carts.push(data);
          return data;
        }
      } catch (error) {
        throw error;
      }
    }
    async read(filter) {
      try {
        const filtered = [...CartsManager.#carts];
        filter.user_id &&
          (filtered = CartsManager.#carts.filter(
            (each) => each.user_id === filter.user_id
          ));
        return filtered;
      } catch (error) {
        throw error;
      }
    }
    //PROGRAMAR PAGINATE EN MEMORY
    async readOne(id) {
      try {
        let note = CartsManager.#carts.find((each) => each.id === id);
        return note;
      } catch (error) {
        throw error;
      }
    }
    async update(id, data) {
      try {
        let one = CartsManager.#carts.find((each) => each.id === id);
        if (one) {
          for (let prop in data) {
            one[prop] = data[prop];
          }
        }
        return one;
      } catch (error) {
        throw error;
      }
    }
    async destroy(id) {
      try {
        let one = CartsManager.#carts.find((each) => each.id === id);
        if (one) {
          CartsManager.#carts = CartsManager.#carts.filter(
            (each) => each.id !== id
          );
        }
        return one;
      } catch (error) {
        throw error;
      }
    }
  }
  
  const cartsManager = new CartsManager();
  export default cartsManager;