import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_MARKER, BLOCK_RETREAT_IF_MARKER, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gastly';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Gothic Fear',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may leave both Active Pokémon Confused.'
  }];

  public attacks = [{
    name: 'Poison Ring',
    cost: [P, C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. That Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter BKT';

  public readonly POISON_RING_MARKER: string = 'POISON_RING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) { return state; }

        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.POISON_RING_MARKER, opponent.active, this);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.POISON_RING_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.POISON_RING_MARKER, this);

    return state;
  }
}