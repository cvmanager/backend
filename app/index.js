import express from 'express'
import mongoose from 'mongoose'
import errorHandler from './exceptions/ErrorHandler.js';
import NotFoundError from './exceptions/NotFoundError.js';
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
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

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));


        if (process.env.NODE_ENV == 'development') {
            app.use(morgan('combined'))
        }
    }

    routes() {
        app.use('/api', route);
        app.use('*', () => { throw new NotFoundError('url not found') });
        app.use(errorHandler);
    }

    serveServer() {
        app.listen(process.env.APP_PORT, () => {
            console.log(`server running at ${process.env.APP_PORT}`)
        })
    }
}

export default App;