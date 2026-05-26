import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { StateLog } from '../store/state/state-log';
export declare class StateLogSerializer implements Serializer<StateLog> {
    readonly types: string[];
    readonly classes: (typeof StateLog)[];
    constructor();
    serialize(stateLog: StateLog): Serialized;
    deserialize(data: Serialized, context: SerializerContext): StateLog;
}
