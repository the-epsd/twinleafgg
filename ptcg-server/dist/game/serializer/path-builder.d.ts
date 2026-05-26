export declare class PathBuilder {
    parents: {
        node: any;
        key: string;
    }[];
    goTo(node: any, key: string): void;
    getPath(): string;
    getValue(root: any, path: string): any;
}
