import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Absol extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 110;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Bad Fall',
      cost: [CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'If you have at least 3 [D] Energy in play, this attack does 50 more damage.'
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Absol';

  public fullName: string = 'Absol SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let energyCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.cards.forEach(card => {
          if (card instanceof EnergyCard) {
            if (card.provides.includes(CardType.DARK) || card.provides.includes(CardType.ANY)) {
              energyCount += 1;
            } else if (card.blendedEnergies.includes(CardType.DARK)) {
              energyCount += 1;
            }
          }
        });
      });


      if (energyCount >= 3)
        effect.damage += 50;
      return state;
    }
    return state;
  }
}