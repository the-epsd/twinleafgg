import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils, CardTarget, PlayerType, SlotType } from '../../../game';
import { MOVE_CARDS, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MegaCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Mega Catcher';
  public fullName: string = 'Mega Catcher FCO';
  public text: string =
    "Switch 1 of your opponent's Benched Mega Evolution Pokémon with his or her Active Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const hasMegaOnBench = opponent.bench.some(
      (b) => b.cards.length > 0 && b.getPokemonCard()?.stage === Stage.MEGA,
    );
    if (!hasMegaOnBench) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Block bench slots that are not Mega Evolution Pokemon
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (target.slot !== SlotType.BENCH) {
          return;
        }
        if (card === undefined || card.stage !== Stage.MEGA) {
          blocked.push(target);
        }
      });

      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { blocked });
    }

    return state;
  }
}
