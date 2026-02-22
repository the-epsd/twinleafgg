import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Simipour extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Panpour';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Collect',
      cost: [W],
      damage: 0,
      text: 'Draw 3 cards.'
    },
    {
      name: 'Stadium Wave',
      cost: [W, C],
      damage: 30,
      damageCalculation: '+',
      text: 'If there is any Stadium card in play, this attack does 30 more damage and the Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Simipour';
  public fullName: string = 'Simipour NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect - draw 3 cards
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 3);
    }

    // Stadium Wave - bonus damage and sleep if stadium in play
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Check if there's a stadium in play
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard !== undefined) {
        effect.damage += 30;
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      }
    }

    return state;
  }
}
