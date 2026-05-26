import { JsonDiff } from './json-patch.interface';
export declare class JsonPatch {
    diff(src: any, dest: any): JsonDiff[];
    apply(src: any, patch: JsonDiff[]): any;
    private delta;
    private deltaArray;
    private deltaObject;
    private isEqual;
    private applyToObject;
    private fromPath;
}
