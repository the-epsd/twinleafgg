export declare function generateToken(userId: number, expire?: number): string;
export declare function validateToken(token: string): number;
export declare function AuthToken(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
