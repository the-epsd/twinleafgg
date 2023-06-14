export declare function deepCompare(x: any, y: any): boolean;
export declare function deepIterate(source: any, callback: (holder: any, key: string, value: any) => void): void;
export declare function deepClone(source: any, ignores?: Function[], refMap?: {
    s: Object;
    d: Object;
}[]): any;
export declare function generateId<T extends {
    id: number;
}[]>(array: T): number;
