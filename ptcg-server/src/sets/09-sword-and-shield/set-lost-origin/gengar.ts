import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import {
  IS_ABILITY_BLOCKED,
  MOVE_CARDS,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Haunter';
  public hp: number = 120;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Netherworld Gate',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, put 3 damage counters on this Pokémon.',
  }];

  public attacks = [{
    name: 'Screaming Circle',
    cost: [P],
    damage: 0,
    text: 'Put 2 damage counters on your opponent\'s Active Pokémon for each of your opponent\'s Benched Pokémon.',
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar LOR';

  public readonly NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NETHERWORLD_GATE_MARKER, this);

    // Netherworld Gate
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!player.discard.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.NETHERWORLD_GATE_MARKER, this);

      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.discard.cards.filter(c => c === this);
      cards.forEach((card, index) => {
        MOVE_CARDS(store, state, player.discard, slots[index], { cards: [card], sourceCard: this });
        store.reduceEffect(
          state,
          new PlaceDamageCountersEffect(player, slots[index], 30, this, this.powers[0]),
        );
      });
    }

    // Screaming Circle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const damageEffect = new PutCountersEffect(effect, opponentBenched * 20);
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }
}
