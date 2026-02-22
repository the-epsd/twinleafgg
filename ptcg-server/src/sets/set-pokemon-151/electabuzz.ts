import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PlayerType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electabuzz extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Electro Combo',
    cost: [CardType.LIGHTNING],
    damage: 10,
    text: 'If Magmar is on your Bench, this attack does 40 more damage.'
  }, {
    name: 'Light Punch',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public name: string = 'Electabuzz';

  public fullName: string = 'Electabuzz MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let isMagmarInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Magmar') {
          isMagmarInPlay = true;
        }
      });

      if (isMagmarInPlay) {
        effect.damage += 40;
      }
      return state;
    }
    return state;
  }
}
