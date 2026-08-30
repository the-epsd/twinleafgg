import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { Serializer, SerializerContext, SerializedState, Serialized } from './serializer.interface';
import { State } from '../store/state/state';
import { Card } from '../store/card/card';
import { GenericSerializer } from './generic.serializer';
import { Rules } from '../store/state/rules';
import { Player } from '../store/state/player';
import { CardSerializer } from './card.serializer';
import { CardListSerializer } from './card-list.serializer';
import { Marker } from '../store/state/card-marker';
import { StateLogSerializer } from './state-log.serializer';
import { PromptSerializer } from './prompt.serializer';
import { PathBuilder } from './path-builder';
import { deepIterate, deepClone } from '../../utils';
import { JsonPatch } from './json-patch';
import { JsonDiff } from './json-patch.interface';
import { GameSettings } from '../core/game-settings';

export class StateSerializer {

  public serializers: Serializer<any>[];
  public static knownCards: Card[] = [];

  constructor() {
    this.serializers = [
      new GenericSerializer(State, 'State'),
      new GenericSerializer(Rules, 'Rules'),
      new GenericSerializer(Player, 'Player'),
      new GenericSerializer(Marker, 'Marker'),
      new GenericSerializer(GameSettings, 'GameSettings'),
      new CardSerializer(),
      new CardListSerializer(),
      new StateLogSerializer(),
      new PromptSerializer()
    ];
  }

  public serialize(state: State): SerializedState {
    const serializers = this.serializers;
    const refs: { node: Object, path: string }[] = [];
    const pathBuilder = new PathBuilder();

    const replacer: any = function (this: any, key: string, value: any) {
      pathBuilder.goTo(this, key);
      const path = pathBuilder.getPath();

      if (typeof value === 'function') {
        return undefined;
      }
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
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown serializer for '${name}'.`);
      }
      return value;
    };
    return JSON.stringify([state.players, state], replacer);
  }

  public deserialize(serializedState: SerializedState): State {
    const serializers = this.serializers;
    const context = this.restoreContext(serializedState);

    const reviver: any = function (this: any, key: string, value: any) {
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object) {
        const name = (value as Serialized)._type;
        if (typeof name === 'string') {
          if (name === 'Ref') {
            return value;
          }
          const serializer = serializers.find(s => s.types.includes(name));
          if (serializer !== undefined) {
            return serializer.deserialize(value, context);
          }
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown deserializer for '${name}'.`);
        }
      }
      return value;
    };

    const parsed = JSON.parse(serializedState, reviver);

    const pathBuilder = new PathBuilder();
    deepIterate(parsed, (holder, key, value) => {
      if (value instanceof Object && value._type === 'Ref') {
        const reference = pathBuilder.getValue(parsed, value.path);
        if (reference === undefined) {
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown reference '${value.path}'.`);
        }
        holder[key] = reference;
      }
    });

    const state = parsed[1];
    return state;
  }

  public serializeDiff(base: SerializedState | undefined, state: State): SerializedState {
    if (base === undefined) {
      return this.serialize(state);
    }
    const serialized2 = this.serialize(state);
    return this.serializeDiffFromSerialized(base, serialized2);
  }

  public serializeDiffFromSerialized(
    base: SerializedState | undefined,
    next: SerializedState
  ): SerializedState {
    if (base === undefined) {
      return next;
    }
    const parsedBase = JSON.parse(base);
    const parsed2 = JSON.parse(next);

    const jsonPatch = new JsonPatch();
    const diff = jsonPatch.diff(
      [parsedBase[0], parsedBase[1]],
      [parsed2[0], parsed2[1]]
    );
    return JSON.stringify([diff]);
  }

  public deserializeDiff(base: SerializedState | undefined, data: SerializedState): State {
    const updatedData = this.applyDiff(base, data);
    return this.deserialize(updatedData);
  }

  public applyDiff(base: SerializedState | undefined, data: SerializedState): SerializedState {
    if (base === undefined) {
      return data;
    }

    const parsed = JSON.parse(data);
    if (parsed.length > 1) {
      return data;
    }

    let [players, state] = JSON.parse(base);
    const diff: JsonDiff[] = parsed[0];

    const jsonPatch = new JsonPatch();
    [players, state] = jsonPatch.apply([players, state], diff);

    return JSON.stringify([players, state]);
  }

  public static setKnownCards(cards: Card[]) {
    StateSerializer.knownCards = cards;
  }

  private restoreContext(serializedState: SerializedState): SerializerContext {
    const parsed = JSON.parse(serializedState);
    const names: string[] = parsed[1].cardNames;
    const cards: Card[] = [];
    names.forEach((name, index) => {
      let card: Card | undefined = StateSerializer.knownCards.find(c => c.fullName === name);
      if (card === undefined) {
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown card '${name}'.`);
      }
      card = deepClone(card) as Card;
      card.id = index;
      cards.push(card);
    });
    return { cards };
  }

}
