import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, StateUtils, CoinFlipPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Magmar';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 130;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Magma Surge',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 3 more damage counters on your opponent’s Burned Pokémon.'
  }];

  public attacks = [
    {
      name: 'Searing Flame',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 90,
      text: 'Flip a coin. If heads, your opponent’s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';

  public name: string = 'Magmortar';
  public fullName: string = 'Magmortar SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Magma Surge
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      let magmortarOwner = null;
      [player, opponent].forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            magmortarOwner = p;
          }
        });
      });
  
      if (!magmortarOwner) {
        return state;
      }
  
      try {
        const stub = new PowerEffect(magmortarOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
  
      const magmortarOpponent = StateUtils.getOpponent(state, magmortarOwner);
      if (effect.player === magmortarOpponent && magmortarOpponent.active.specialConditions.includes(SpecialCondition.BURNED)) {
        effect.burnDamage += 30;
        console.log('magmortar:', effect.burnDamage);
      }
    }

    // Searing Flame
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
        
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
          return store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }

}