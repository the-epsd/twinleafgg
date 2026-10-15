import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class TogedemaruEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 190;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Stun Needle',
    cost: [M],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  },
{
    name: 'Spiky Rolling',
    cost: [M, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon used Spiky Rolling during your last turn, this attack does 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Togedemaru ex';
  public fullName: string = 'Togedemaru ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stun Needle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Spiky Rolling
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.CLEAR_BUBBLE_MARKER, this)) {
      effect.damage += 80;
      }
    }

    return state;
  }
}
