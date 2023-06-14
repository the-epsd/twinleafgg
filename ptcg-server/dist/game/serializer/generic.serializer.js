export class GenericSerializer {
    constructor(creatorClass, constructorName) {
        this.creatorClass = creatorClass;
        this.constructorName = constructorName;
        this.types = [constructorName];
        this.classes = [creatorClass];
    }
    serialize(state) {
        const constructorName = this.constructorName;
        return Object.assign({ _type: constructorName }, state);
    }
    deserialize(data, context) {
        const instance = new this.creatorClass();
        delete data._type;
        return Object.assign(instance, data);
    }
}
