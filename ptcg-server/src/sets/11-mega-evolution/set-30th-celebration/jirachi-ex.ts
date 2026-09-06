import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../../game/store/prefabs/attack-effects';

export class Jirachiex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 160;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wish Granter',
    cost: [C],
    damage: 0,
    text: 'Draw cards until you have 7 cards in your hand.'
  },
  {
    name: 'Swift',
    cost: [C, C, C],
    damage: 150,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Jirachi ex';
  public fullName: string = 'Jirachi ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wish Granter
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(effect.player, 7);
    }

    // Swift
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 150);
    }

    return state;
  }
}
