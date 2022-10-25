import expressJSDocSwagger from 'express-jsdoc-swagger'
import mongoose from 'mongoose'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

import NotFoundError from './exceptions/NotFoundError.js';
import errorHandler from './exceptions/ErrorHandler.js';
import i18n from './middlewares/lang.middleware.js'
import options from './docs/swaggerSpecs.js'
import route from './routes/route.js'
import rateLimiter from '../app/middlewares/rate-limiter.js'
const app = express();
class App {
    constructor() {
        this.setConfig();
        this.databaseConnect();
        this.routes();
        this.serveServer();
    }

    async databaseConnect() {

        await mongoose.connect(
            `mongodb://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }, (err) => {
                if (err) console.error('FAILED TO CONNECT TO DATABASE ...');
                console.log('successfuly connect to database ...');

            }
        );
    }

    setConfig() {
        dotenv.config();
        app.use(cors());
        app.use(i18n.init);
        app.use(rateLimiter);

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));

        expressJSDocSwagger(app)(options);

        if (process.env.NODE_ENV == 'development') {
            app.use(morgan('combined'))
        }
    }

    routes() {
        app.use('/api/v1/', route);
        app.use('*', () => { throw new NotFoundError('error.url_not_found') });
        app.use(errorHandler);
    }

    serveServer() {
        app.listen(process.env.PORT, (err) => {
            if(err) console.error(`can not run server in port ${process.env.PORT}`)
            console.log(`server running at ${process.env.PORT}`)
        })
    }
}

export default App;