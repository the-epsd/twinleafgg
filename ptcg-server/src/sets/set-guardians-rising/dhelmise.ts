import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dhelmise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Steelworker',
    powerType: PowerType.ABILITY,
    text: 'Your [M] Pokémon\'s attacks do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Anchor Shot',
    cost: [P, C, C],
    damage: 70,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Dhelmise';
  public fullName: string = 'Dhelmise GRI';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const hasDhelmiseInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfDhelmiseInPlay = 0;

      if (hasDhelmiseInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfDhelmiseInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL) && effect.target === opponent.active) {
        effect.damage += 10 * numberOfDhelmiseInPlay;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}