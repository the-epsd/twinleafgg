import { SerializerContext, Serialized, Serializer } from './serializer.interface';
export declare class GenericSerializer<T extends Object> implements Serializer<T> {
    private creatorClass;
    private constructorName;
    types: string[];
    classes: (new () => T)[];
    constructor(creatorClass: new () => T, constructorName: string);
    serialize(state: T): Serialized;
    deserialize(data: Serialized, context: SerializerContext): T;
}
