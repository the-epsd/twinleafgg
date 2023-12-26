import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Luxray extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 160;

  public weakness = [ { type:CardType.FIGHTING } ];

  public retreat = [ ];

  public powers = [{
    name: 'Swelling Flash',
    powerType: PowerType.ABILITY,
    text: '' 
  }];

  public attacks = [{

    name: 'Tail Snap',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray CRZ';



  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.hand.cards.includes(this)) {
        if (player.active == undefined) {
          state = store.prompt(state, new ConfirmPrompt(
            effect.player.id,
            GameMessage.WANT_TO_USE_ABILITY,
          ), wantToUse => {
            if (wantToUse) {
              player.hand.cards.findIndex(card => card === this);
              player.hand.moveCardTo(this, player.active);
              return state;
            }
            return state;
          });
          return state;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}
