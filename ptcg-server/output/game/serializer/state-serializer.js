"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSerializer = void 0;
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const state_1 = require("../store/state/state");
const generic_serializer_1 = require("./generic.serializer");
const rules_1 = require("../store/state/rules");
const player_1 = require("../store/state/player");
const card_serializer_1 = require("./card.serializer");
const card_list_serializer_1 = require("./card-list.serializer");
const card_marker_1 = require("../store/state/card-marker");
const state_log_serializer_1 = require("./state-log.serializer");
const prompt_serializer_1 = require("./prompt.serializer");
const path_builder_1 = require("./path-builder");
const utils_1 = require("../../utils");
const json_patch_1 = require("./json-patch");
class StateSerializer {
    constructor() {
        this.serializers = [
            new generic_serializer_1.GenericSerializer(state_1.State, 'State'),
            new generic_serializer_1.GenericSerializer(rules_1.Rules, 'Rules'),
            new generic_serializer_1.GenericSerializer(player_1.Player, 'Player'),
            new generic_serializer_1.GenericSerializer(card_marker_1.Marker, 'Marker'),
            new card_serializer_1.CardSerializer(),
            new card_list_serializer_1.CardListSerializer(),
            new state_log_serializer_1.StateLogSerializer(),
            new prompt_serializer_1.PromptSerializer()
        ];
    }
    serialize(state) {
        const serializers = this.serializers;
        const refs = [];
        const pathBuilder = new path_builder_1.PathBuilder();
        const replacer = function (key, value) {
            pathBuilder.goTo(this, key);
            const path = pathBuilder.getPath();
            if (value instanceof Array) {
                return value;
            }
            if (value instanceof Object && value._type !== 'Ref') {
                const ref = refs.find(r => r.node === value);
                if (ref !== undefined) {
                    return { _type: 'Ref', path: ref.path };
                }
                refs.push({ node: value, path });
                const name = value.constructor.name;
                if (name === 'Object') {
                    return value;
                }
                const serializer = serializers.find(s => s.classes.some(c => value instanceof c));
                if (serializer !== undefined) {
                    return serializer.serialize(value);
                }
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown serializer for '${name}'.`);
            }
            return value;
        };
        return JSON.stringify([state.players, state], replacer);
    }
    deserialize(serializedState) {
        const serializers = this.serializers;
        const context = this.restoreContext(serializedState);
        const reviver = function (key, value) {
            if (value instanceof Array) {
                return value;
            }
            if (value instanceof Object) {
                const name = value._type;
                if (typeof name === 'string') {
                    if (name === 'Ref') {
                        return value;
                    }
                    const serializer = serializers.find(s => s.types.includes(name));
                    if (serializer !== undefined) {
                        return serializer.deserialize(value, context);
                    }
                    throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown deserializer for '${name}'.`);
                }
            }
            return value;
        };
        const parsed = JSON.parse(serializedState, reviver);
        // Restore Refs
        const pathBuilder = new path_builder_1.PathBuilder();
        utils_1.deepIterate(parsed, (holder, key, value) => {
            if (value instanceof Object && value._type === 'Ref') {
                const reference = pathBuilder.getValue(parsed, value.path);
                if (reference === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown reference '${value.path}'.`);
                }
                holder[key] = reference;
            }
        });
        const state = parsed[1];
        return state;
    }
    serializeDiff(base, state) {
        if (base === undefined) {
            return this.serialize(state);
        }
        const parsedBase = JSON.parse(base);
        const players1 = parsedBase[0];
        const state1 = parsedBase[1];
        const serialized2 = this.serialize(state);
        const parsed2 = JSON.parse(serialized2);
        const players2 = parsed2[0];
        const state2 = parsed2[1];
        const jsonPatch = new json_patch_1.JsonPatch();
        const diff = jsonPatch.diff([players1, state1], [players2, state2]);
        return JSON.stringify([diff]);
    }
    deserializeDiff(base, data) {
        const updatedData = this.applyDiff(base, data);
        return this.deserialize(updatedData);
    }
    applyDiff(base, data) {
        if (base === undefined) {
            return data;
        }
        const parsed = JSON.parse(data);
        if (parsed.length > 1) {
            return data;
        }
        let [players, state] = JSON.parse(base);
        const diff = parsed[0];
        const jsonPatch = new json_patch_1.JsonPatch();
        [players, state] = jsonPatch.apply([players, state], diff);
        return JSON.stringify([players, state]);
    }
    static setKnownCards(cards) {
        StateSerializer.knownCards = cards;
    }
    restoreContext(serializedState) {
        const parsed = JSON.parse(serializedState);
        const names = parsed[1].cardNames;
        const cards = [];
        names.forEach((name, index) => {
            let card = StateSerializer.knownCards.find(c => c.fullName === name);
            if (card === undefined) {
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Unknown card '${name}'.`);
            }
            card = utils_1.deepClone(card);
            card.id = index;
            cards.push(card);
        });
        return { cards };
    }
}
exports.StateSerializer = StateSerializer;
StateSerializer.knownCards = [];
