import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { endGame } from '../../game/store/effect-reducers/check-effect';

export class NsSigilyph extends PokemonCard {

  public tags = [CardTag.NS];

  public regulationMark = 'I';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 110;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Psy Sphere',
      cost: [P],
      damage: 20,
      text: ''
    },
    {
      name: 'Victory Sigil',
      cost: [P, C, C],
      damage: 0,
      text: 'If you have exactly 1 Prize card remaining when using this attack, you win this game.'
    }
  ];

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'N\'s Sigilyph';

  public fullName: string = 'N\'s Sigilyph SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      if (player.prizes.length === 6) {
        state = endGame(store, state, player.id);
        return state;
      }

    }

    return state;
  }
}