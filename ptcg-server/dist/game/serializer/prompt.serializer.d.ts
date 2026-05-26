import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { Prompt } from '../store/prompts/prompt';
export declare class PromptSerializer implements Serializer<Prompt<any>> {
    readonly types: string[];
    readonly classes: any[];
    private rows;
    constructor();
    serialize(prompt: Prompt<any>): Serialized;
    deserialize(data: Serialized, context: SerializerContext): Prompt<any>;
}
