"use strict";
exports.__esModule = true;
exports.StateSerializer = void 0;
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var state_1 = require("../store/state/state");
var generic_serializer_1 = require("./generic.serializer");
var rules_1 = require("../store/state/rules");
var player_1 = require("../store/state/player");
var card_serializer_1 = require("./card.serializer");
var card_list_serializer_1 = require("./card-list.serializer");
var card_marker_1 = require("../store/state/card-marker");
var state_log_serializer_1 = require("./state-log.serializer");
var prompt_serializer_1 = require("./prompt.serializer");
var path_builder_1 = require("./path-builder");
var utils_1 = require("../../utils");
var json_patch_1 = require("./json-patch");
var StateSerializer = /** @class */ (function () {
    function StateSerializer() {
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
    StateSerializer.prototype.serialize = function (state) {
        var serializers = this.serializers;
        var refs = [];
        var pathBuilder = new path_builder_1.PathBuilder();
        var replacer = function (key, value) {
            pathBuilder.goTo(this, key);
            var path = pathBuilder.getPath();
            if (value instanceof Array) {
                return value;
            }
            if (value instanceof Object && value._type !== 'Ref') {
                var ref = refs.find(function (r) { return r.node === value; });
                if (ref !== undefined) {
                    return { _type: 'Ref', path: ref.path };
                }
                refs.push({ node: value, path: path });
                var name_1 = value.constructor.name;
                if (name_1 === 'Object') {
                    return value;
                }
                var serializer = serializers.find(function (s) { return s.classes.some(function (c) { return value instanceof c; }); });
                if (serializer !== undefined) {
                    return serializer.serialize(value);
                }
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown serializer for '" + name_1 + "'.");
            }
            return value;
        };
        return JSON.stringify([state.players, state], replacer);
    };
    StateSerializer.prototype.deserialize = function (serializedState) {
        var serializers = this.serializers;
        var context = this.restoreContext(serializedState);
        var reviver = function (key, value) {
            if (value instanceof Array) {
                return value;
            }
            if (value instanceof Object) {
                var name_2 = value._type;
                if (typeof name_2 === 'string') {
                    if (name_2 === 'Ref') {
                        return value;
                    }
                    var serializer = serializers.find(function (s) { return s.types.includes(name_2); });
                    if (serializer !== undefined) {
                        return serializer.deserialize(value, context);
                    }
                    throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown deserializer for '" + name_2 + "'.");
                }
            }
            return value;
        };
        var parsed = JSON.parse(serializedState, reviver);
        // Restore Refs
        var pathBuilder = new path_builder_1.PathBuilder();
        utils_1.deepIterate(parsed, function (holder, key, value) {
            if (value instanceof Object && value._type === 'Ref') {
                var reference = pathBuilder.getValue(parsed, value.path);
                if (reference === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown reference '" + value.path + "'.");
                }
                holder[key] = reference;
            }
        });
        var state = parsed[1];
        return state;
    };
    StateSerializer.prototype.serializeDiff = function (base, state) {
        if (base === undefined) {
            return this.serialize(state);
        }
        var parsedBase = JSON.parse(base);
        var players1 = parsedBase[0];
        var state1 = parsedBase[1];
        var serialized2 = this.serialize(state);
        var parsed2 = JSON.parse(serialized2);
        var players2 = parsed2[0];
        var state2 = parsed2[1];
        var jsonPatch = new json_patch_1.JsonPatch();
        var diff = jsonPatch.diff([players1, state1], [players2, state2]);
        return JSON.stringify([diff]);
    };
    StateSerializer.prototype.deserializeDiff = function (base, data) {
        var updatedData = this.applyDiff(base, data);
        return this.deserialize(updatedData);
    };
    StateSerializer.prototype.applyDiff = function (base, data) {
        var _a;
        if (base === undefined) {
            return data;
        }
        var parsed = JSON.parse(data);
        if (parsed.length > 1) {
            return data;
        }
        var _b = JSON.parse(base), players = _b[0], state = _b[1];
        var diff = parsed[0];
        var jsonPatch = new json_patch_1.JsonPatch();
        _a = jsonPatch.apply([players, state], diff), players = _a[0], state = _a[1];
        return JSON.stringify([players, state]);
    };
    StateSerializer.setKnownCards = function (cards) {
        StateSerializer.knownCards = cards;
    };
    StateSerializer.prototype.restoreContext = function (serializedState) {
        var parsed = JSON.parse(serializedState);
        var names = parsed[1].cardNames;
        var cards = [];
        names.forEach(function (name, index) {
            var card = StateSerializer.knownCards.find(function (c) { return c.fullName === name; });
            if (card === undefined) {
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Unknown card '" + name + "'.");
            }
            card = utils_1.deepClone(card);
            card.id = index;
            cards.push(card);
        });
        return { cards: cards };
    };
    StateSerializer.knownCards = [];
    return StateSerializer;
}());
exports.StateSerializer = StateSerializer;
