import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Gothitelle2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gothorita';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smack',
      cost: [P],
      damage: 30,
      text: ''
    },
    {
      name: 'Mental Shock',
      cost: [P, C, C],
      damage: 60,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, discard an Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Gothitelle';
  public fullName: string = 'Gothitelle EPO 48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        } else {
          const energyCards = opponent.active.cards.filter(c => c instanceof EnergyCard);
          if (energyCards.length > 0) {
            opponent.active.moveCardTo(energyCards[0], opponent.discard);
          }
        }
      });
    }
    return state;
  }
}
