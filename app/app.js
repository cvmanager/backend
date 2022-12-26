
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import NotFoundError from './exceptions/NotFoundError.js';
import errorHandler from './exceptions/ErrorHandler.js';
import i18n from './middlewares/lang.middleware.js'
import swaggerOptions from './docs/swaggerSpecs.js'
import route from './routes/route.js'
import rateLimiter from './middlewares/rate-limiter.js'
import expressJSDocSwagger from 'express-jsdoc-swagger'
import env from './helper/env.js'


const app = express();

dotenv.config();
app.use(cors());
app.use(i18n.init);
app.use(rateLimiter);

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: false }));

expressJSDocSwagger(app)(swaggerOptions);

if (env('NODE_ENV') == 'development') app.use(morgan('combined'))

app.use('/api/v1/', route);
app.use('*', () => { throw new NotFoundError('system.errors.url_not_found') });
app.use(errorHandler);

export default  app;