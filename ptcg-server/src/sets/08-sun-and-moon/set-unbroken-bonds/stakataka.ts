import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { CardTag, PowerType, StoreLike, State, StateUtils, GameLog, CardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, COIN_FLIP_PROMPT, GET_PLAYER_PRIZES } from '../../../game/store/prefabs/prefabs';


export class Stakataka extends PokemonCard {
  protected _tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Wall of Stone',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon\'s maximum HP is 200.'
  }];

  public attacks = [{
    name: 'Top Down',
    cost: [F, F, C],
    damage: 110,
    text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
  }];

  public set = 'UNB';
  public setNumber = '106';
  public cardImage = 'assets/cardback.png';
  public name = 'Stakataka';
  public fullName = 'Stakataka UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power 1: Wall of Stone
    // Ref: set-phantom-forces/gourgeist.ts (Gourgantic)
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player)

      if (GET_PLAYER_PRIZES(opponent).length <= 3) {
        effect.hp += 80;
        return state;
      }

      return state;
    }

    // Attack 1: Top Down
    // Ref: set-perfect-order/tyrantrum.ts (Wreak Havoc)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const flipCoins = (s: State): State => {
        if (opponent.deck.cards.length === 0) {
          return s;
        }

        return COIN_FLIP_PROMPT(store, s, player, result => {
          if (result === true) {
            // Heads - discard top card
            const deckTop = new CardList();
            opponent.deck.moveTo(deckTop, 1);
            if (deckTop.cards.length > 0) {
              store.log(s, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: deckTop.cards[0].name, effectName: 'Top Down' });
              deckTop.moveTo(opponent.discard);
            }
            // Continue flipping
            flipCoins(s);
          }
        });
      };

      return flipCoins(state);
    }

    return state;
  }
}