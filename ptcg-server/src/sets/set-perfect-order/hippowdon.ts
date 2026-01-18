import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, TrainerCard, TrainerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED, MOVE_CARDS } from "../../game/store/prefabs/prefabs";

export class Hippowdon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Hippopotas';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tornado Drill',
    cost: [F, F, C],
    damage: 80,
    text: 'If you played Tarragon from your hand during this turn, discard the top 3 cards from your opponent\'s deck.'
  },
  {
    name: 'Heavy Impact',
    cost: [F, F, C, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Hippowdon';
  public fullName: string = 'Hippowdon M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tornado Drill - discard top 3 cards if Tarragon was played
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if Tarragon was played this turn (check if it's in discard and was a supporter)
      const tarragonPlayed = player.discard.cards.some(card =>
        card instanceof TrainerCard &&
        card.trainerType === TrainerType.SUPPORTER &&
        card.name === 'Tarragon' &&
        player.supporterTurn === state.turn
      );

      if (tarragonPlayed && opponent.deck.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 3, sourceCard: this, sourceEffect: this.attacks[0] });
      }
    }

    return state;
  }
}
