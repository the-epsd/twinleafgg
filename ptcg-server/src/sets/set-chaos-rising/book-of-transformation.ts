import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardTarget, GameError, GameMessage, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType, StoreLike, State } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class BookOfTransformation extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Book of Transformation';
  public fullName: string = 'Book of Transformation M4';
  public text: string = 'You must play 2 Book of Transformation cards at once. Switch 1 of your Basic Pokemon in play with 1 of your Basic Pokemon in your discard pile. (Any attached cards, damage counters, and effects remain on the new Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const name = effect.trainerCard.name;
      const second = player.hand.cards.find(c => c.name === name && c !== effect.trainerCard);
      if (second === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const hasBasicInPlay = player.active.cards.some(c => c instanceof PokemonCard && (c as PokemonCard).stage === Stage.BASIC) ||
        player.bench.some(b => b.cards.some(c => c instanceof PokemonCard && (c as PokemonCard).stage === Stage.BASIC));
      const hasBasicInDiscard = player.discard.cards.some(c => c instanceof PokemonCard && (c as PokemonCard).stage === Stage.BASIC);
      if (!hasBasicInPlay || !hasBasicInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      effect.preventDefault = true;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card && (card as PokemonCard).stage !== Stage.BASIC) {
          blocked.push(target);
        }
      });
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), inPlaySelected => {
        const inPlayTargets = inPlaySelected || [];
        if (inPlayTargets.length === 0) return state;
        const inPlayList = inPlayTargets[0];
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 1, max: 1, allowCancel: false }
        ), discardSelected => {
          const fromDiscard = discardSelected || [];
          if (fromDiscard.length === 0) return state;
          const inPlayCard = inPlayList.getPokemonCard();
          if (inPlayCard && inPlayList.cards.length > 0) {
            inPlayList.moveCardTo(inPlayList.cards[0], player.discard);
          }
          player.discard.moveCardTo(fromDiscard[0], inPlayList);
          player.hand.moveCardTo(second, player.discard);
        });
      });
    }
    return state;
  }
}
