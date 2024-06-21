import { Attack, CardType, PlayerType, PokemonCard, Power, PowerType, Stage, State, StoreLike } from '../../game';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kricketot';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;

  public powers: Power[] = [
    {
      name: 'Swelling Tune',
      powerType: PowerType.ABILITY,
      useWhenInPlay: false,
      text: 'Your [G] Pokémon in play, except any Kricketune, get +40 HP. You can\'t apply more than 1 Swelling Tune Ability at a time.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Slash',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune ASR';
  
  public SWELLING_TUNE_MARKER = 'SWELLING_TUNE_MARKER';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
      
    if (effect instanceof CheckHpEffect && effect.player.bench.some(b => b.cards.includes(this))) {
      const player = effect.player;
      
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          cardList.marker.removeMarker(this.SWELLING_TUNE_MARKER, this);
        });  
        
        return state;
      }
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS) && !cardList.marker.hasMarker(this.SWELLING_TUNE_MARKER) && 
            !cardList.cards.includes(this)) {
          cardList.hp += 40;
          cardList.marker.addMarker(this.SWELLING_TUNE_MARKER, this);
        }
      });
      
      return state;
    }
    
    return state;
  }
}
