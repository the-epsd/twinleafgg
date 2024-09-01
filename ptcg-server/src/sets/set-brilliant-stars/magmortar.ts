import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game';


export class Magmortar extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magmar';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 140;

  public weakness = [{
    type: CardType.WATER
  }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Mega Punch',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }, {
    name: 'Boltsplosion',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 120,
    damageCalculation: '+',
    text: 'If Electivire is on your Bench, this attack does 120 more damage.'
  }];

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Magmortar';

  public fullName: string = 'Magmortar BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isElectivireInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Electivire') {
          isElectivireInPlay = true;
        }
      });

      if (isElectivireInPlay) {
        effect.damage += 120;
      }
      return state;
    }
    return state;
  }
}
