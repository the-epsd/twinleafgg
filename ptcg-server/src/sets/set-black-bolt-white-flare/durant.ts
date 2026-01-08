import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Durant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite Together',
    cost: [C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Durant is on your Bench, this attack does 20 more damage.'
  }, {
    name: 'Vice Grip',
    cost: [M, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'WHT';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Durant';
  public fullName: string = 'Durant WHT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let isDurantInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Durant' && cardList !== player.active) {
          isDurantInPlay = true;
        }
      });

      if (isDurantInPlay) {
        effect.damage += 20;
      }
      return state;
    }
    return state;
  }
}
