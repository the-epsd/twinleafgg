import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Durant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Swarming Rage',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each damage counter on all of your Durant.',
  }, {
    name: 'Hard Scissors',
    cost: [M, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).',
  }
  ];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Durant';
  public fullName: string = 'Durant PAR';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let totalDamage = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === 'Durant') {
          totalDamage += cardList.damage;
        }
      });

      effect.damage = totalDamage * 2;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }
}