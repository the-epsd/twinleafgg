import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { EnergyCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Drampa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dragon Claw',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Dragon Arcana',
      cost: [C, C, C],
      damage: 70,
      damageCalculation: '+',
      text: 'If this Pokémon has 2 or more different types of basic Energy attached to it, this attack does 70 more damage.'
    },
  ];

  public set = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name = 'Drampa';
  public fullName = 'Drampa CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const attachedEnergyTypes = new Set<CardType>();
      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard && card.provides) {
          card.provides.forEach(energyType => {
            if (energyType !== CardType.COLORLESS && energyType !== CardType.ANY) {
              attachedEnergyTypes.add(energyType);
            }
          });
        }
      });

      if (attachedEnergyTypes.size >= 2) {
        effect.damage += 70;
      }
    }
    return state;
  }
}