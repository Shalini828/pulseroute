import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
  openapi: "3.0.0",
  info: {
    title: "PulseRoute API",
    version: "1.0.0",
    description: "AI Gateway API Documentation",
  },
  servers: [
    {
      url: "http://localhost:8080/api/v1",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
},
  apis: [
    "./src/modules/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);