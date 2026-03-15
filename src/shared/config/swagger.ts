import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API",
      version: "1.0.0",
      description: "REST API for authentication, users and tasks management",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Tasks", description: "Task management endpoints" },
      { name: "Users", description: "User endpoints" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        SafeUser: {
          type: "object",
          required: ["id", "email", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              example: "clx123abc456",
            },
            name: {
              type: "string",
              nullable: true,
              example: "Kolya",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-15T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-15T12:00:00.000Z",
            },
          },
        },

        Task: {
          type: "object",
          required: [
            "id",
            "title",
            "text",
            "status",
            "userId",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "string",
              example: "clx_task_123",
            },
            title: {
              type: "string",
              example: "Finish Swagger docs",
            },
            text: {
              type: "string",
              example: "Describe auth and tasks endpoints",
            },
            status: {
              type: "string",
              enum: ["TODO", "DOING", "DONE"],
              example: "TODO",
            },
            userId: {
              type: "string",
              example: "clx123abc456",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-15T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-15T12:00:00.000Z",
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              example: "Kolya",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              example: "password123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },

        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token",
            },
          },
        },

        AuthSuccessResponse: {
          type: "object",
          required: ["accessToken", "refreshToken", "user"],
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.token",
            },
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token",
            },
            user: {
              $ref: "#/components/schemas/SafeUser",
            },
          },
        },

        RefreshSuccessResponse: {
          type: "object",
          required: ["accessToken", "refreshToken"],
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.token",
            },
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.refresh.token",
            },
          },
        },

        LogoutResponse: {
          type: "object",
          required: ["success"],
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
          },
        },

        CreateTaskRequest: {
          type: "object",
          required: ["title", "text", "status"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 120,
              example: "Finish backend day 9",
            },
            text: {
              type: "string",
              maxLength: 2000,
              example: "Add Swagger/OpenAPI documentation",
            },
            status: {
              type: "string",
              enum: ["TODO", "DOING", "DONE"],
              example: "TODO",
            },
          },
        },

        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 120,
              example: "Finish backend day 9",
            },
            text: {
              type: "string",
              maxLength: 2000,
              example: "Add Swagger/OpenAPI documentation",
            },
            status: {
              type: "string",
              enum: ["TODO", "DOING", "DONE"],
              example: "DOING",
            },
          },
        },

        CreateUserRequest: {
          type: "object",
          required: ["email", "passwordHash"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              example: "Kolya",
            },
            passwordHash: {
              type: "string",
              example: "$2b$10$hashedPasswordExample",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message"],
              properties: {
                code: {
                  type: "string",
                  example: "UNAUTHORIZED",
                },
                message: {
                  type: "string",
                  example: "Unauthorized",
                },
              },
            },
          },
        },

        ValidationErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message", "details"],
              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },
                message: {
                  type: "string",
                  example: "Validation failed",
                },
                details: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    properties: {
                      email: {
                        errors: ["Invalid email"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      responses: {
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
        UnauthorizedError: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ConflictError: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);