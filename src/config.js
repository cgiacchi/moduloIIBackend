import * as url from 'url';

const config= {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: 'mongodb+srv://cgiacchi:coder@cluster0.ofansrx.mongodb.net/',
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    PRODUCTS_COLLECTION: 'products',
    CARTS_COLLECTION: 'carts'
};

export default config;