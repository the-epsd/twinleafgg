import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Deoxys extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.FUSION_STRIKE, CardTag.SINGLE_STRIKE, CardTag.RAPID_STRIKE ];

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Photon Boost',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 80,
      text: 'If this Pokémon has any Fusion Strike Energy attached, this attack does 80 more damage.'
    },
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '120';

  public name: string = 'Deoxys';

  public fullName: string = 'Deoxys FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const pokemon = player.active;
  
      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);
  
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;

        if (energyCard instanceof EnergyCard && energyCard.name == 'Fusion Strike Energy')
          effect.damage += 80;
      });
      return state;
    }
    return state;
  }
}