import Sentry from '@sentry/node'
import winston from 'winston';

class Logger {
    req;

    constructor(req) {
        this.req = req;

        if (process.env.NODE_ENV == 'production') {
            Sentry.init({
                dsn: process.env.SENTRY_DNS,
                tracesSampleRate: process.env.SENTRY_TRACESSAMPLERATE,
            });

            Sentry.configureScope(scope => {
                if (req.user_id) scope.setUser({ id: req.user_id });
            });
        }

    }

    static builder(req) {
        return new Logger(req);
    }


    async setExeption(err) {
        try {
            if (process.env.NODE_ENV == 'production') await Sentry.captureException(err);

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