/* eslint-disable indent */
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cobalion extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];
  
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Quick Guard',
      cost: [ CardType.METAL ],
      damage: 0,
      text: 'Prevent all damage done to this Pokémon by attacks from Basic Pokémon during your opponent\'s next turn. This Pokémon can\'t use Quick Guard during your next turn.',
    },
    {
      name: 'Revenge Blast',
      cost: [ CardType.METAL, CardType.METAL ],
      damage: 30,
      damageCalculation: '+',      
      text: 'This attack does 30 more damage for each Prize card your opponent has taken.',
    },
  ];

  public set: string = 'STS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Cobalion';

  public fullName: string = 'Cobalion STS';
  
  public QUICK_GUARD_MARKER = 'QUICK_GUARD_MARKER';
  public CLEAR_QUICK_GUARD_MARKER = 'CLEAR_QUICK_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.QUICK_GUARD_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_QUICK_GUARD_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.QUICK_GUARD_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.BASIC) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_QUICK_GUARD_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_QUICK_GUARD_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.QUICK_GUARD_MARKER, this);
        });
      }
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const prizesTaken = 6 - opponent.getPrizeLeft();
      effect.damage += prizesTaken * 30;
    }
    
    return state;
  }
}