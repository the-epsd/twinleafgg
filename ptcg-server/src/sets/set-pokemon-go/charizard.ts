import {
  Attack,
  EnergyCard,
  Power,
  PowerType,
  Resistance,
  State,
  StoreLike,
  Weakness
} from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Charizard extends PokemonCard {
  
  public set = 'PGO';
  
  public setNumber = '53';
  
  public cardImage: string = 'assets/cardback.png';  
  
  public fullName = 'Charizard PGO';
  
  public name = 'Charizard';
  
  public cardType: CardType = CardType.FIRE;
  
  public evolvesFrom: string = 'Charmeleon';
  
  public stage: Stage = Stage.STAGE_2;
  
  public hp: number = 170;
  
  public weakness: Weakness[] = [{ type: CardType.WATER }];
  
  public resistance: Resistance[] = [];
  
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  
  public powers: Power[] = [
    {
      name: 'Burn Brightly',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,      
      text: 'Each basic [R] Energy attached to your Pokémon provides [R][R] Energy. You can\'t apply more than 1 Burn Brightly Ability at a time.'
    }
  ];
  
  public attacks: Attack[] = [
    {
      name: 'Flare Blitz',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 170,
      text: 'Discard all [R] Energy from this Pokémon.'      
    }
  ];
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      
      [...player.bench, player.active].forEach(cardList => {
        cardList.cards.forEach(c => {
          if (c.superType === SuperType.ENERGY) {
            const energyCard = c as EnergyCard;
            
            if (energyCard.energyType === EnergyType.BASIC && energyCard.provides.includes(CardType.FIRE)) {
              energyCard.provides.push(...energyCard.provides);
            }
          }
        })
      })
    }
    
    return state;
  };
}
