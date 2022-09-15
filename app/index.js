const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const errorHandler = require('./middleware/ErorHandler');
const NotFoundError = require('./middleware/NotFoundError');
const app = express();
class App {
    constructor() {
        this.setConfig();
        this.connectTODB();
        this.routes();
        this.serveServer();
    }

    async connectTODB() {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


    }

    setConfig() {
        require('dotenv').config();

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            cookie: { maxAge: process.env.COOKIE_MAXAGE },
            secret: process.env.COOKIE_SECRET,
            resave: process.env.COOKIE_RESAVE,
            saveUninitialized: process.env.COOKIE_SAVE_UNINITIALIZED
        }));
    }

    routes() {
        let route = require('./routes/route');
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

module.exports = App;