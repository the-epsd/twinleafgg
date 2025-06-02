import { StoreLike, State } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianPerrserkerV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = M;
  public hp: number = 200;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Feelin\' Fine',
      cost: [C],
      damage: 0,
      text: 'Draw 3 cards.'
    },
    {
      name: 'Treasure Rush',
      cost: [M, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each card in your hand.'
    }
  ];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Galarian Perrserker V';
  public fullName: string = 'Galarian Perrserker V SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Feelin' Fine
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 3);
    }

    // Treasure Rush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = 20 * effect.player.hand.cards.length;
    }

    return state;
  }
}