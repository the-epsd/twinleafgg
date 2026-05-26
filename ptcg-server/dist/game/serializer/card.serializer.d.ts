import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { Card } from '../store/card/card';
export declare class CardSerializer implements Serializer<Card> {
    readonly types: string[];
    readonly classes: (typeof Card)[];
    constructor();
    serialize(card: Card): Serialized;
    deserialize(data: Serialized, context: SerializerContext): Card;
}
