import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, PokemonCard, PowerType, ShuffleDeckPrompt } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public set2: string = 'silvertempest';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public powers = [{
    name: 'Forest Seal Stone',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for a card and put it into ' +
          'your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR' +
          'Power in a game.)'
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.tool === this) {
          const pokemon = card as PokemonCard;

          pokemon.powers.push(this.powers[0]);
        }});
    

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
        { min: 1, max: 1, allowCancel: false }
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
  
