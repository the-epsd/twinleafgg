import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Scrunch',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
  }, {
    name: 'Double-Edge',
    cost: [C, C, C, C],
    damage: 80,
    text: 'This Pokémon does 80 damage to itself.'
  }];

  public set: string = 'EVO';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey EVO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scrunch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    // Double-Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 80);
    }

    return state;
  }
}
