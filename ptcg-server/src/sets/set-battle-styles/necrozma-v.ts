import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class NecrozmaV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Prismatic Ray',
      cost: [ CardType.PSYCHIC ],
      damage: 30,
      text: 'This attack also does 20 damage to 2 of your opponent’s ' +
        'Benched Pokémon. (Don’t apply Weakness and Resistance ' +
        'for Benched Pokémon.) '
    },
    {
      name: 'Special Laser',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 100,
      text: 'If this Pokémon has any Special Energy attached, this ' +
        'attack does 120 more damage. '
    }
  ];

  public set: string = 'BST';

  public set2: string = 'battlestyles';

  public setNumber: string = '63';

  public name: string = 'Necrozma V';

  public fullName: string = 'Necrozma V BST 063';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const pokemon = player.active;
  
      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);
  
      let damage = 100;
  
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {
          damage += 120;
        }
      });
  
      effect.damage = damage;
  
    }
    return state; 
  }
}