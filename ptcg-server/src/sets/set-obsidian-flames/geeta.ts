import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, SlotType, ChooseCardsPrompt, ShuffleDeckPrompt, Card, ChoosePokemonPrompt } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Geeta extends TrainerCard {
  public regulationMark = 'G';
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '188';
  public name: string = 'Geeta';
  public fullName: string = 'Geeta OBF';

  public text: string =
    'Search your deck for up to 2 Basic Energy cards and attach them to 1 of your Pokémon. Then, shuffle your deck. During this turn, your Pokémon can\'t attack. (This includes Pokémon that come into play this turn.)';

  public readonly GEETA_MARKER = 'GEETA_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        return state;
      }
    
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
    
      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: true }
          ), targets => {
            if (!targets || targets.length === 0) {
              player.supporter.moveTo(player.discard);
              return;
            }
            const target = targets[0];
            player.deck.moveCardsTo(cards, target);
            player.marker.addMarker(this.GEETA_MARKER, this);
            player.supporter.moveTo(player.discard);
          });
        }
      });
    
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    if (effect instanceof AttackEffect && effect.player.marker.hasMarker(this.GEETA_MARKER, this)){
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.GEETA_MARKER, this)){
      effect.player.marker.removeMarker(this.GEETA_MARKER, this);
    }

    return state;
  }
}