import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Mandibuzz extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vullaby';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bone Rush',
      cost: [D],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Dark Pulse',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 10 more damage for each [D] Energy attached to all of your Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Mandibuzz';
  public fullName: string = 'Mandibuzz EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, headsCount => {
        (effect as AttackEffect).damage = 30 * headsCount;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let darkEnergy = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.cards.forEach(card => {
          if (card.superType === SuperType.ENERGY && (card as EnergyCard).provides.includes(CardType.DARK)) {
            darkEnergy++;
          }
        });
      });

      (effect as AttackEffect).damage += 10 * darkEnergy;
    }

    return state;
  }
}
