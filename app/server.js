import mongoose from 'mongoose'

import rbacConfig, { createPermissions } from './helper/rbac.js';
import env from './helper/env.js'
import app from './app.js'
import cron from 'node-cron'
import NotificationService from './helper/service/notification.service.js'

class App {
    constructor() {
        this.start();
    }

    start() {
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(data => {
                console.log('successfully connect to database ...');
                this.serve();
            })
            .catch(err => console.error('failed to connect to database ...' + err))

        cron.schedule(env('CRON_SCHEDULE_NOTIFICATION_TIME'), () => {
            NotificationService.sendNotification(env('CRON_SCHEDULE_NOTIFICATION_LIMIT'));
        });
    }


    serve() {
        app.listen(env('PORT'), async (err) => {
            if (err) console.error(`can not run server in port ${env('PORT')}`)

            await createPermissions(app)
            await rbacConfig()

            console.log(`server running at ${env('PORT')}`)
        })
    }
}

export default App;