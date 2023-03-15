import Sentry from '@sentry/node'
import winston from 'winston';
import env from '../helper/env.js'

class Logger {
    req;

    constructor(req) {
        this.req = req;
        console.log(env('SENTRY_DNS'));
        Sentry.init({
            dsn: env('SENTRY_DNS'),
            tracesSampleRate: env('SENTRY_TRACESSAMPLERATE'),
            environment: env('NODE_ENV')
        });

        Sentry.configureScope(scope => {
            if (req.user && req.user._id) scope.setUser({ id: req.user._id });
        });


    }

    static builder(req) {
        return new Logger(req);
    }


    async setExeption(err) {
        try {
            await Sentry.captureException(err);

            const today = new Date();
            let newdate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            await winston.add(new winston.transports.File({ filename: `./app/logs/${newdate}.log` }));
            await winston.error(err.message, err);
        } catch (err) {
            next(err);
        }
    }
}

export default Logger