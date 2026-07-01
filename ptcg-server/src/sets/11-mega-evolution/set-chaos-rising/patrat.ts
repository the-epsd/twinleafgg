import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard, PlayerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MoveDamageCountersEffect } from '../../../game/store/effects/game-effects';

export class Patrat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [
    {
      name: 'Watchful Eye',
      powerType: PowerType.ABILITY,
      text: "Damage counters on each Pokémon (both yours and your opponent's) can't be moved to other Pokémon.",
    },
  ];
  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Patrat';
  public fullName: string = 'Patrat M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveDamageCountersEffect) {
      let hasPatrat = false;
      state.players.forEach((p) => {
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
