import env from '../helper/env.js'

let swaggerServer = [];


switch (env('NODE_ENV')) {
    case 'production':
        swaggerServer.push({
            "url": "https://api.cvmanager.ir/api/v1",
            "description": "Production server",
        })
        break;
    default:
        swaggerServer.push({
            "url": `http://127.0.0.1:${env('PORT')}/api/v1`,
            "description": "Development server"
        })
}


export default swaggerServer;
