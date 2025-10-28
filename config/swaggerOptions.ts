import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Employee Directory and Branch Management API Documentation",
            version: "1.0.0",
            description:
                "This is the API documentation for the Employee Directory and Branch Management application.",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/validations/*.ts"], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};