import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Relicanth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fossil Beatdown',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each of your Benched Pokémon with "Antique" in its name.',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '17';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Relicanth';
  public fullName: string = 'Relicanth M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let antiqueBench = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        if (card.tags.includes(CardTag.ANTIQUE)) {
          antiqueBench++;
        }
      });
      effect.damage += 30 * antiqueBench;
    }
    return state;
  }
}
