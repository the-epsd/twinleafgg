import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack, Power, PowerType, Weakness } from '../../game/store/card/pokemon-types';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Machamp extends PokemonCard {
  
  public set = 'BS';
  
  public fullName = 'Machamp BS';
  
  public name = 'Machamp';

  public cardImage: string = 'assets/cardback.png';

  public stage: Stage = Stage.STAGE_2;
  
  public evolvesFrom: string = 'Machoke';

  public setNumber: string = '8';
  
  public hp: number = 100;
  
  public cardType: CardType = CardType.FIGHTING;
  
  public weakness: Weakness[] = [{ type: CardType.PSYCHIC }];
  
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [
    {
      name: 'Strikes Back',
      powerType: PowerType.POKEPOWER,
      text: 'Whenever your opponent\'s attack damages Machamp (even if Machamp is Knocked Out), this power does 10 damage to the attacking Pokémon. (Don\'t apply Weakness and Resistance.) This power can\'t be used if Machamp is Asleep, Confused, or Paralyzed when your opponent attacks.'
    }
  ];

  public attacks: Attack[] = [
    {
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      name: 'Seismic Toss',
      damage: 60,
      text: ''
    }
  ];
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect) {

      const player = effect.player;
      
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      
      if (cardList.specialConditions.length > 0) {
        return state;
      }
      
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
  
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 10;
      }
    }
    
    return state;
  }
}