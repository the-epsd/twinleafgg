import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Woobat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Nasal Suction',
      cost: [ C ],
      damage: 0,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Air Cutter',
      cost: [ P ],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
    
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Woobat';
  public fullName: string = 'Woobat CEC';

  public readonly NASAL_SUCTION_MARKER = 'NASAL_SUCTION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nasal Suction
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;
      opponent.active.marker.addMarker(this.NASAL_SUCTION_MARKER, this);
      opponent.marker.addMarker(this.NASAL_SUCTION_MARKER, this);
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)) {
      effect.player.marker.removeMarker(this.NASAL_SUCTION_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)){
          cardList.marker.removeMarker(this.NASAL_SUCTION_MARKER, this);
        }
      });
    }

    // Air Cutter
    if (WAS_ATTACK_USED(effect, 1, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (!result) { effect.damage = 0; } });
    }

    return state;
  }
}