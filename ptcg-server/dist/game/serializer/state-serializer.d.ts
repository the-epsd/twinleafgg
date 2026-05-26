import { Serializer, SerializedState } from './serializer.interface';
import { State } from '../store/state/state';
import { Card } from '../store/card/card';
export declare class StateSerializer {
    serializers: Serializer<any>[];
    static knownCards: Card[];
    constructor();
    serialize(state: State): SerializedState;
    deserialize(serializedState: SerializedState): State;
    serializeDiff(base: SerializedState | undefined, state: State): SerializedState;
    deserializeDiff(base: SerializedState | undefined, data: SerializedState): State;
    applyDiff(base: SerializedState | undefined, data: SerializedState): SerializedState;
    static setKnownCards(cards: Card[]): void;
    private restoreContext;
}
