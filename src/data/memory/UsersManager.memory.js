class UsersManager {
    static #users = [];
    async create(data) {
      try {
        if (!data.email || !data.password) {
          throw new Error("INGRESE EMAIL/PASSWORD");
        } else {
          UsersManager.#users.push(data);
          return data;
        }
      } catch (error) {
        throw error;
      }
    }
    async read(role) {
      try {
        return UsersManager.#users;
      } catch (error) {
        throw error;
      }
    }
    async readById(id) {
      try {
        let note = UsersManager.#users.find((each) => each.id === id);
        return note;
      } catch (error) {
        throw error;
      }
    }
    async readByEmail(email) {
      try {
        let note = UsersManager.#users.find((each) => each.email === email);
        return note;
      } catch (error) {
        throw error;
      }
    }
    //PROGRAMAR READBYEMAIL EN MEMORY
    async update(id, data) {
      try {
        let one = UsersManager.#users.find((each) => each.id === id);
        if (one) {
          for (let prop in data) {
            one[prop] = data[prop];sers.filter(
            (each) => each.id !== id
          );
        }
    
        return one;
      }
    } catch (error) {
        throw error;
      }
    }
  }

  const usersManager = new UsersManager();
  export default usersManager;