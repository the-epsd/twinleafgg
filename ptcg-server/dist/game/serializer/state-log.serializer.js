import { StateLog } from '../store/state/state-log';
export class StateLogSerializer {
    constructor() {
        this.types = ['StateLog'];
        this.classes = [StateLog];
    }
    serialize(stateLog) {
        return Object.assign(Object.assign({}, stateLog), { _type: 'StateLog' });
    }
    deserialize(data, context) {
        delete data._type;
        const instance = new StateLog(data.message, data.params, data.client);
        return Object.assign(instance, data);
    }
}
