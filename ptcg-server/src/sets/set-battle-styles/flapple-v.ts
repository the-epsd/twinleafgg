import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CardTag } from '../../game/store/card/card-types';

export class FlappleV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Sour Spit',
    cost: [ CardType.GRASS ],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s ' +
    'attacks cost {C}{C} more.'
  }, {
    name: 'Wing Attack',
    cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 120,
    text: ''
  }];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '18';

  public name: string = 'Flapple V';

  public fullName: string = 'Flapple V BST';

  public readonly FLAPPLE_V_MARKER = 'FLAPPLE_V_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sour Spit
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.FLAPPLE_V_MARKER, this);
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.active.marker.hasMarker(this.FLAPPLE_V_MARKER, this)) {
      effect.cost.push(CardType.COLORLESS, CardType.COLORLESS); 
    }  

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.FLAPPLE_V_MARKER, this);
    }

    return state; 
  }
}

