import express from 'express';
import cors from 'cors';
import initRoutes from "./src/routes.mjs"

const app = express();

const port = 3001;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
initRoutes(app)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

export { app }