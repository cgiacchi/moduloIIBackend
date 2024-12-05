import * as url from 'url';

const config= {
    PORT: 9000,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    PRODUCTS_COLLECTION: 'products',
    CARTS_COLLECTION: 'carts'
};

export default config;