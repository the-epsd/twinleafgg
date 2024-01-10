import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Card, PokemonCardList, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class HisuianElectrodeV extends PokemonCard {

  public stage = Stage.BASIC;

  public cardType = CardType.GRASS;

  public hp = 210;

  public tags = [CardTag.POKEMON_V];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tantrum Blast',
      cost: [ ],
      damage: 100,
      text: 'This attack does 100 damage for each Special Condition affecting this Pokémon.'
    },
    {
      name: 'Solar Shot',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 120,
      text: 'Discard all Energy from this Pokémon.'
    },
  ];

  public regulationMark = 'F';

  public set = 'SWSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '294';

  public name = 'Hisuian Electrode V';

  public fullName = 'Hisuian Electrode V SWSH';

  public SOLAR_SHOT_MARKER = 'SOLAR_SHOT_MARKER';

  public CLEAR_SOLAR_SHOT_MARKER = 'CLEAR_SOLAR_SHOT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
  
      effect.damage = cardList.specialConditions.length * 100;

      return state;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
          
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);  
          
      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);  
      const discardEnergy = new DiscardCardsEffect(effect, cards);  
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);  
    }
      
    return state; 
  }
        
}