import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public powers = [{
    name: 'Starpirth',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for up to ' +
      '2 cards and put them into your hand. Then, shuffle your ' +
      'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tool instanceof ForestSealStone) {

          const target = cardList;
          const forestSeal = new CheckPokemonPowersEffect(target);
          forestSeal.target = cardList;
        }

        state = store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          { min: 0, max: 2, allowCancel: false }
        ), cards => {
          player.deck.moveCardsTo(cards, player.hand);

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);



          });

          return state;
        });
      });

      return state;
    }

    return state;
  }

}