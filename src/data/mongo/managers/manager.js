class Manager {

    constructor(model) {
        this.model = model
    }

    create = async (data) => {
        try {
            const one = await this.model.create(data)
            return one
        } catch (error) {
            throw error
        }
    }

    read = async (data) => {
        try {
            const all = await this.model.find(data).lean()
            return all
        } catch (error) {
            throw error
        }
    }

    async readByEmail(email) {
        try {
            const one = await this.model.findOne({ email }).lean();
            if (!one) {
                throw new Error('User not found');
            }
            return one;
        } catch (error) {
            throw new Error(`Error fetching user by email: ${error.message}`);
        }
    }
    async readById(id) {
        try {
            const one = await this.model.findOne({ _id: id }).lean();
            if (!one) {
                throw new Error('Cart not found');
            }
            return one;
        } catch (error) {
            throw new Error(`Error reading cart: ${error.message}`);
        }
    }
    async readAllPaginated(query, opts) {
        try {
            const all = await this.model.paginate(query, opts);
            if (!all) {
                throw new Error('No products found with given query');
            }
            return all;
        } catch (error) {
            throw new Error(`Error fetching paginated products: ${error.message}`);
        }
    }
    update = async (id, data) => {
        try {
            const opt = { new: true }
            const one = await this.model.findByIdAndUpdate(id, data, opt)
            return one
        } catch (error) {
            throw error
        }
    }

    destroy = async (id) => {
        try {
            const one = await this.model.findByIdAndDelete(id)
            return one
        } catch (error) {
            throw error
        }
    }

}

export default Manager