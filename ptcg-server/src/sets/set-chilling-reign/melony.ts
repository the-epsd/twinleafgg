import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType } from '../../game';


function* playCard(next: Function, store: StoreLike, state: State,
  self: Melony, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }


  let cards: Card[] = [];

  
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Water Energy' },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      { allowCancel: true }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      const target = targets[0];
      if (!target.cards[0].tags.includes(CardTag.POKEMON_V) &&
        !target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) &&
        !target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
        player.deck.moveCardsTo(cards, target);
        next();
      }
      

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    });
  }}

export class Melony extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '146';

  public regulationMark = 'E';

  public name: string = 'Melony';

  public fullName: string = 'Melony CRE 146';

  public text: string =
    'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    
    return state;
  }
    
}