import expressJSDocSwagger from 'express-jsdoc-swagger'
import mongoose from 'mongoose'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

import NotFoundError from './exceptions/NotFoundError.js';
import errorHandler from './exceptions/ErrorHandler.js';
import i18n from './middlewares/lang.middleware.js'
import swaggerOptions from './docs/swaggerSpecs.js'
import route from './routes/route.js'
import rateLimiter from '../app/middlewares/rate-limiter.js'
import env from './helper/env.js'
const app = express();
class App {
    constructor() {
        this.setConfig();
        this.databaseConnect();
        this.routes();
        this.serveServer();
    }

    databaseConnect() {
        mongoose.connect(
            `mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
            .then(data => console.log('successfuly connect to database ...'))
            .catch(err => console.error('failed to connect to database ...'))
    }

    setConfig() {
        dotenv.config();
        app.use(cors());
        app.use(i18n.init);
        app.use(rateLimiter);

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));

        expressJSDocSwagger(app)(swaggerOptions);

        if (env('NODE_ENV') == 'development') app.use(morgan('combined'))
    }

    routes() {
        app.use('/api/v1/', route);
        app.use('*', () => { throw new NotFoundError('system.errors.url_not_found') });
        app.use(errorHandler);
    }

    serveServer() {
        app.listen(env('PORT'), (err) => {
            if (err) console.error(`can not run server in port ${env('PORT')}`)
            console.log(`server running at ${env('PORT')}`)
        })
    }
}

export default App;