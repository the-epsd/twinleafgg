import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS, SHUFFLE_CARDS_INTO_DECK } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Plusle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tag Draw',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw 4 cards. If Minun is on your Bench, draw 4 more cards.'
  }, {
    name: 'Positive Ion',
    cost: [L],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 more damage.'
  }];

  public set: string = 'DEX';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Plusle';
  public fullName: string = 'Plusle DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tag Draw - shuffle hand into deck, draw 4 (or 8 if Minun on Bench)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Shuffle hand into deck
      const handCards = player.hand.cards.slice();
      if (handCards.length > 0) {
        SHUFFLE_CARDS_INTO_DECK(store, state, player, handCards);
      }

      // Check if Minun is on the bench
      const hasMinun = player.bench.some(b => b.getPokemonCard()?.name === 'Minun');

      // Draw 4 cards (or 8 if Minun is on Bench)
      const cardsToDraw = hasMinun ? 8 : 4;
      DRAW_CARDS(player, cardsToDraw);
    }

    // Positive Ion - flip a coin, if heads +10 damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}
