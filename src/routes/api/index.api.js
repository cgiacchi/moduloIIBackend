import { Router } from "express";
import productsApiRouter from "./products.api.js";
import cookiesApiRouter from "./cookies.api.js";
import cartsApiRouter from "./carts.api.js";
import usersApiRouter from "./users.api.js";
import sessionsApiRouter from "./sessions.api.js";

const apiRouter = Router()

apiRouter.use("/products", productsApiRouter);
apiRouter.use("/cookies", cookiesApiRouter);
apiRouter.use("/carts", cartsApiRouter);
apiRouter.use("/users", usersApiRouter);
apiRouter.use("/sessions", sessionsApiRouter);
apiRouter.use("/home", homeApiRouter);

export default apiRouter;