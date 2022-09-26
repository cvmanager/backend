const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./exceptions/ErorHandler');
const NotFoundError = require('./exceptions/NotFoundError');
let cors = require('cors');


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
        require('dotenv').config();
        app.use(cors());

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));
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