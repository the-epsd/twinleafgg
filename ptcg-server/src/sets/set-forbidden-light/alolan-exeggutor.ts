import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class AlolanExeggutor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Exeggcute';

  public cardType: CardType = G;

  public hp: number = 160;

  public weakness = [{ type: R }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Tropical Shake',
      cost: [G],
      damage: 20,
      text: 'This attack does 20 more damage for each type of Basic Energy card in your discard pile. ' +
        'You can\'t add more than 100 damage in this way.'
    },
  ];

  public set: string = 'FLI';

  public setNumber: string = '2';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Alolan Exeggutor';

  public fullName: string = 'Alolan Exeggutor FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const energyTypes: CardType[] = [];
      player.discard.cards.forEach(c => {
        if ((c instanceof EnergyCard) && (c.energyType == EnergyType.BASIC)) {
          for (const et of c.provides) {
            if (!energyTypes.includes(et)) { energyTypes.push(et); }
          }
        }
      });
      effect.damage += Math.min(energyTypes.length * 20, 100);
    }
    return state;
  }
}