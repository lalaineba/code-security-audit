import { CorsOptions } from "cors";

/**
 * Environment-Based CORS Configuration
 * In development: allows all origins to test easily with different ports and tools
 * in production: restricted security to protect API from unauthorized access.
 * 
 * @returns {Corsoptions} A CORS configuration object
 */
export const getCorsConfig = (): CorsOptions => {
    const isDevelopment: boolean = process.env.NODE_ENV === "development";

    if (isDevelopment) {
        // Allow all origins in development for easy testing
        return {
            origin: true,
            credentials: true,
        } as CorsOptions;
    }

    // Strict origins in production
    return {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    } as CorsOptions;
};
