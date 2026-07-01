import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Carnivine extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Big Bite',
    cost: [C, C],
    damage: 30,
    text: ' During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
  },
  {
    name: 'Triple Whip',
    cost: [G, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'BST';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Carnivine BST';
  public name: string = 'Carnivine';
  public setNumber: string = '9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 60 * heads;
      });
      return state;
    }

    return state;
  }
}