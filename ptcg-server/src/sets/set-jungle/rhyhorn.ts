import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Rhyhorn extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public resistance = [{ type: L, value: -30 }];
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Leer',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack Rhyhorn during your opponent\'s next turn. (Benching either Pokémon ends this effect.)'
  }, {
    name: 'Horn Attack',
    cost: [F, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Rhyhorn';
  public fullName: string = 'Rhyhorn JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    return state;
  }
}