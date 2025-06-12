import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList, EnergyCard, PlayerType, PowerType, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Chromashift',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon is the same type as any basic Energy attached to it. (If it has 2 or more different types of basic Energy attached, this Pokémon is each of those types.)'
  }];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [C, C, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'CRE';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon CRE';
  public setNumber: string = '122';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this){
      const player = StateUtils.findOwner(state, effect.target);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this){
          const energies = new CardList();
          energies.cards = cardList.cards.filter(card => card instanceof EnergyCard && card.energyType === EnergyType.BASIC);

          if (energies.cards.length === 0){
            effect.cardTypes = [C];
            return state;
          }

          effect.cardTypes = [ ];

          energies.cards.forEach(energy => {
            switch (energy.name){
              case 'Grass Energy': effect.cardTypes.push(G); break;  
              case 'Water Energy': effect.cardTypes.push(W); break; 
              case 'Fire Energy': effect.cardTypes.push(R); break;
              case 'Lightning Energy': effect.cardTypes.push(L); break; 
              case 'Psychic Energy': effect.cardTypes.push(P); break;
              case 'Fighting Energy': effect.cardTypes.push(F); break;
              case 'Darkness Energy': effect.cardTypes.push(D); break; 
              case 'Metal Energy': effect.cardTypes.push(M); break;
              case 'Fairy Energy': effect.cardTypes.push(Y); break; 
            }
            console.log(effect.cardTypes.length);
          });
        }
      });
    }
    
    return state;
  }
}