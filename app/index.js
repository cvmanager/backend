import mongoose from 'mongoose'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

import NotFoundError from './exceptions/NotFoundError.js';
import errorHandler from './exceptions/ErrorHandler.js';
import i18n from './middlewares/lang.middleware.js'
import route from './routes/route.js'

const app = express();
class App {
    constructor() {
        this.setConfig();
        this.databaseConnect();
        this.routes();
        this.serveServer();
    }

    async databaseConnect() {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    setConfig() {
        dotenv.config();
        app.use(cors());
        app.use(i18n.init);

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));


        if (process.env.NODE_ENV == 'development') {
            app.use(morgan('combined'))
        }
    }

    routes() {
        app.use('/api', route);
        app.use('*', () => { throw new NotFoundError('exceptions.url_not_found') });
        app.use(errorHandler);
    }

    serveServer() {
        app.listen(process.env.APP_PORT, () => {
            console.log(`server running at ${process.env.APP_PORT}`)
        })
    }
}

export default App;