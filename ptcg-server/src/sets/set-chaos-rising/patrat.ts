import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PokemonCard, PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MoveDamageCountersEffect } from '../../game/store/effects/game-effects';

export class Patrat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];
  public powers = [{
    name: 'Watchful Eyes',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is in play, you and your opponent can\'t move damage counters to another Pokemon.'
  }];
  public attacks = [{
    name: 'Bite',
    cost: [C],
    damage: 10,
    text: ''
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Patrat';
  public fullName: string = 'Patrat M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveDamageCountersEffect) {
      let hasPatrat = false;
      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card?.name === 'Patrat') hasPatrat = true;
        });
      });
      if (hasPatrat) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}
