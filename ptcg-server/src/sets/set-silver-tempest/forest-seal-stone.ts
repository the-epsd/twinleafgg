import { ChooseCardsPrompt, GameError, GameMessage, PowerType, ShuffleDeckPrompt, State, StoreLike, TrainerCard } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public useWhenAttached = true;

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public powers = [{
    name: 'Forest Seal Stone',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for up to ' +
      '2 cards and put them into your hand. Then, shuffle your ' +
      'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // if (targetCard && targetCard.tags.includes(CardTag.POKEMON_V) ||targetCard && targetCard.tags.includes(CardTag.POKEMON_VMAX || targetCard && targetCard.tags.includes(CardTag.POKEMON_VSTAR))) {
    if (effect instanceof PowerEffect && 
        (effect.card.tags.includes(CardTag.POKEMON_V) || 
        effect.card.tags.includes(CardTag.POKEMON_VMAX) || 
        effect.card.tags.includes(CardTag.POKEMON_VSTAR))) {

      const player = effect.player;
      
      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.VSTAR_MARKER, this);

      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });
    }

    return state;
  }
}