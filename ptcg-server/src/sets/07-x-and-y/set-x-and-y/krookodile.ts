import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS, SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from "../../../game/store/prefabs/prefabs";

export class Krookodile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Krokorok';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bother',
    cost: [D, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, your opponent can\'t play any Supporter cards from his or her hand during his or her next turn.'
  },
  {
    name: 'Knock Back',
    cost: [D, D, C, C],
    damage: 80,
    text: 'Your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'XY';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Krookodile';
  public fullName: string = 'Krookodile XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bother
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    return state;
  }
}
