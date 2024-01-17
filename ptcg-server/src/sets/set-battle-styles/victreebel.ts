import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, PlayerType, StateUtils, } from '../../game';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Victreebel extends PokemonCard {
  public readonly TIME_CIRCLE_MARKER: string = 'TIME_CIRCLE_MARKER';
  public readonly CLEAR_TIME_CIRCLE_MARKER: string = 'CLEAR_TIME_CIRCLE_MARKER';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Weepinbell';

  public regulationMark = 'E';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  
  public attacks = [
    {
      name: 'Panic Vine',
      cost: [ CardType.GRASS ],
      damage: 40,
      text: 'Your opponent\'s Active Pokémon is now Confused. During' +
      'your opponent\'s next turn, that Pokémon can\'t retreat.'
    },
    {
      name: 'Solar Beam',
      cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Victreebel';

  public fullName: string = 'Victreebel BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
      opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
      return state;
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.marker.hasMarker(this.CLEAR_TIME_CIRCLE_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
        });
      }
    }

    return state;
  }

}
