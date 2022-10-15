import rateLimit from 'express-rate-limit'
import ManyRequestsError from '../exceptions/ManyRequestsError.js'

const Ratelimiter = rateLimit({
    windowMs: process.env.API_LIMIT_RATE_MINUT_TIME * 60 * 1000, // 15 minutes
    max: process.env.API_LIMIT_RATE, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // handler: () => {},
    handler: (req, res, next) => {
        try {
            throw new ManyRequestsError()
        } catch (err) {
            next(err);
        }
    }
})

// Apply the rate limiting middleware to all requests
export default Ratelimiter