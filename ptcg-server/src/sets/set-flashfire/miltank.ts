import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PlayerType } from '../../game/store/actions/play-card-action';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Miltank extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Powerful Friends',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: 'If you have any Stage 2 Pokemon on your Bench, ' +
        'this attack does 70 more damage.'
    },
    {
      name: 'Hammer In',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    },
  ];

  public set: string = 'FLF';

  public name: string = 'Miltank';

  public fullName: string = 'Miltank FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let hasStage2 = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage === Stage.STAGE_2) {
          hasStage2 = true;
        }
      });

      if (hasStage2) {
        effect.damage += 70;
      }
    }

    return state;
  }

}
