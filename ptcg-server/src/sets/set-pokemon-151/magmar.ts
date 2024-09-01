import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game';


export class Magmar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Live Coal',
    cost: [CardType.FIRE],
    damage: 10,
    text: ''
  }, {
    name: 'Flare Combo',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 80,
    damageCalculation: '+',
    text: 'If Electabuzz is on your Bench, this attack does 80 more damage.'
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '126';

  public name: string = 'Magmar';

  public fullName: string = 'Magmar MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isElectabuzzInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Electabuzz') {
          isElectabuzzInPlay = true;
        }
      });

      if (isElectabuzzInPlay) {
        effect.damage += 80;
      }
      return state;
    }
    return state;
  }
}
