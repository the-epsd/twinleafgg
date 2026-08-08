import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, STADIUM_AND_TOOL_CARDS_HAVE_NO_EFFECT } from "../../../game/store/prefabs/prefabs";

export class Shiftry extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nuzleaf';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wicked Wind',
    cost: [G],
    damage: 40,
    text: 'Until the end of your opponent\'s next turn, each Stadium or Pokémon Tool card in play has no effect. (This includes cards that come into play on that turn.)'
  },
  {
    name: 'Extrasensory',
    cost: [C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If you have the same number of cards in your hand as your opponent, this attack does 60 more damage.'
  }];

  public set: string = 'STS';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shiftry';
  public fullName: string = 'Shiftry STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wicked Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return STADIUM_AND_TOOL_CARDS_HAVE_NO_EFFECT(store, state, effect, this);
    }

    // Extrasensory
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.hand.cards.length === opponent.hand.cards.length) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
