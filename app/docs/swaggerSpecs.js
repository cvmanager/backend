const options = {
  info: {
    version: '1.0.0',
    title: 'CV Manager',
    description: "",

  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  servers: [
    {
      "url": `http://localhost:${process.env.PORT}/api/v1`,
      "description": "Development server"
    }
  ]
  ,
  // Base directory which we use to locate your JSDOC files
  baseDir: "./app",
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: [
    './http/controllers/*.controller.js',
    './docs/*.doc.js'
  ],
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api/v1/docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

export default options