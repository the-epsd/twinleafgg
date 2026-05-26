import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { CardList } from '../store/state/card-list';
export declare class CardListSerializer implements Serializer<CardList> {
    readonly types: string[];
    readonly classes: (typeof CardList)[];
    constructor();
    serialize(cardList: CardList): Serialized;
    deserialize(data: Serialized, context: SerializerContext): CardList;
    private fromIndex;
}
