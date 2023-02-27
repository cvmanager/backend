import mongoose from 'mongoose'

import rbacConfig, { createPermissions } from './helper/rbac.js';
import env from './helper/env.js'
import app from './app.js'

class App {
    constructor() {
        this.start();
    }

    start() {
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb://localhost:27017/cvProject`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(data => {
                console.log('successfully connect to database ...');
                this.serve();
            })
            .catch(err => console.error('failed to connect to database ...' + err))
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