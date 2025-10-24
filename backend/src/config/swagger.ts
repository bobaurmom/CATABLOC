import swaggerJSDoc from "swagger-jsdoc";
import { Router } from "express";       

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CATABLOC API",
            version: "1.0.0",
            description: "Comprehensive API documentation for CATABLOC authentication system",
        },
        servers: [
            {
                url: "http://localhost:8000",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1,
                            description: "Unique user identifier"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                            description: "User's email address"
                        },
                        username: {
                            type: "string",
                            example: "username",
                            description: "User's unique username"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-01T00:00:00.000Z",
                            description: "User creation timestamp"
                        },
                    },
                    required: ["id", "email", "username", "createdAt", "updatedAt"]
                },
                RegisterRequest: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                            description: "User's email address"
                        },
                        username: {
                            type: "string",
                            minLength: 3,
                            maxLength: 50,
                            pattern: "^[a-zA-Z0-9_-]+$",
                            example: "username",
                            description: "Username (3-50 chars, letters, numbers, underscore, hyphen only)"
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            example: "SecurePass123!",
                            description: "Password (min 8 chars, must contain uppercase, lowercase, number, special char)"
                        },
                        confirmPassword: {
                            type: "string",
                            example: "SecurePass123!",
                            description: "Password confirmation (must match password)"
                        }
                    },
                    required: ["email", "username", "password", "confirmPassword"]
                },
                LoginRequest: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                            description: "User's email address"
                        },
                        password: {
                            type: "string",
                            example: "SecurePass123!",
                            description: "User's password"
                        }
                    },
                    required: ["email", "password"]
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                            description: "Indicates if the request was successful"
                        },
                        message: {
                            type: "string",
                            example: "User registered successfully",
                            description: "Response message"
                        },
                        data: {
                            type: "object",
                            properties: {
                                user: {
                                    $ref: "#/components/schemas/User"
                                },
                                token: {
                                    type: "string",
                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    description: "JWT access token"
                                },
                                refreshToken: {
                                    type: "string",
                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    description: "JWT refresh token"
                                }
                            }
                        }
                    }
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                            description: "Indicates if the request was successful"
                        },
                        message: {
                            type: "string",
                            example: "Profile retrieved successfully",
                            description: "Response message"
                        },
                        data: {
                            $ref: "#/components/schemas/User"
                        }
                    }
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                            description: "Indicates if the request was successful"
                        },
                        message: {
                            type: "string",
                            example: "Account deleted successfully",
                            description: "Response message"
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                            description: "Indicates if the request was successful"
                        },
                        message: {
                            type: "string",
                            example: "Validation failed",
                            description: "Error message"
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: {
                                        type: "string",
                                        example: "email",
                                        description: "Field that caused the error"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Please provide a valid email address",
                                        description: "Field-specific error message"
                                    }
                                }
                            }
                        }
                    }
                },
                ValidationError: {
                    type: "object",
                    properties: {
                        field: {
                            type: "string",
                            example: "password",
                            description: "Field that failed validation"
                        },
                        message: {
                            type: "string",
                            example: "Password must be at least 8 characters long",
                            description: "Validation error message"
                        }
                    }
                }
            }
        }
        
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/app.ts"],
};
let swaggerDocs : any;
try {
    swaggerDocs = swaggerJSDoc(swaggerOptions);
    console.log("Swagger documentation generated successfully.");
} catch (error) {
    console.error("Error generating Swagger documentation:", error);
    swaggerDocs = {
        openapi: "3.0.0",
        info: {
            title: "CATABLOC API",
            version: "1.0.0",
            description: "API DOCS UNAVAILABLE DUE TO AN ERROR",
        },
        paths: {}

    };
}

export default swaggerDocs;