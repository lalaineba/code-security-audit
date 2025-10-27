import { HelmetOptions } from "helmet";

export const getHelmetConfig = (): HelmetOptions => {
    const isDevelopment: boolean = process.env.NODE_ENV === "development";

    // Base configuration for APIs
    const baseConfig: HelmetOptions = {
        contentSecurityPolicy: false,
        noSniff: true,
    };

    if (isDevelopment) {
        return {
            ...baseConfig,
            // No HTTPS enforcement in development
            hsts: false,
        } as HelmetOptions;
    }

    // Production gets full security
    return {
        ...baseConfig,
        hsts: {
            maxAge: 3153600,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: "deny" },
        referrerPolicy: { policy: "no-referrer" },
    } as HelmetOptions;
};
