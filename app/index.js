const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
class App {
    constructor() {
        this.connectTODB();
        this.setConfig();
        this.routes();
        this.serveServer();
    }

    async connectTODB() {
        // await mongoose.connect('mongodb://localhost/cvmanager', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false,
        //     useCreateIndex: true
        // });
    }
    setConfig() {
        require('dotenv').config();

        app.use(express.json({ strict: false }));
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            cookie: { maxAge: 60000 },
            secret: 'ABC',
            resave: false,
            saveUninitialized: false
        }));
    }

    routes() {
        let route = require('./routes/route');
        app.use('api/', route);
    }

    serveServer() {
        app.listen(process.env.PORT, () => {
            console.log(`server running at ${process.env.PORT}`)
        })
    }
}

module.exports = App;