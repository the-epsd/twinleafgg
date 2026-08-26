import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, TrainerCard, SlotType, GameMessage, ShowCardsPrompt } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public hp: number = 130;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Poltergeist',
    cost: [P],
    damage: 50,
    damageCalculation: 'x',
    text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
  },
  {
    name: 'Hollow Dive',
    cost: [P, C],
    damage: 110,
    text: 'Put 3 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poltergeist
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
        const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
        const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);
        effect.damage = damage.length * 50;
      });
    }

    // Hollow Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const hasBenched = opponent.bench.some((b) => b.cards.length > 0);
      if (hasBenched) {
        PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect, [SlotType.BENCH]);
      }
    }

    return state;
  }
}
