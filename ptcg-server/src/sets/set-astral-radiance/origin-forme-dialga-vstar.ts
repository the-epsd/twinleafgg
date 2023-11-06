

import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, 
  GamePhase, 
  StateUtils} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class OriginFormeDialgaVSTAR extends PokemonCard {

  public tags = [ CardTag.POKEMON_VSTAR ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  //public evolvesFrom = 'Palkia V';

  public cardType: CardType = CardType.METAL;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [  ];

  public attacks = [
    {
      name: 'Star Chronos',
      cost: [ ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '114';

  public name: string = 'Origin Forme Dialga VSTAR';

  public fullName: string = 'Origin Forme Dialga VSTAR ASR';

  CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      if (state.phase === GamePhase.ATTACK) {

        const player = effect.player;

        const opponent = StateUtils.getOpponent(state, player);

        opponent.marker.addMarker(this.CLEAR_WITHDRAW_MARKER, this);

        if (opponent.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {
          if (GamePhase.BETWEEN_TURNS) {
            player.deck.moveTo(player.hand, 0);
         
            state.turn--;
            const endTurnEffect = new EndTurnEffect(opponent);
            store.reduceEffect(state, endTurnEffect);
            return state;
          }

        }
      }
      return state;
    }
    return state;
  }
}