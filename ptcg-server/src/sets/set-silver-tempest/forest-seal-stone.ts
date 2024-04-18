
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, ShuffleDeckPrompt, State, StoreLike, TrainerCard } from '../../game';

import { TrainerType } from '../../game/store/card/card-types';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
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

  public powers = [
    {
      name: 'Forest Seal Stone',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      text: 'During your turn, you may search your deck for up to ' +
    '2 cards and put them into your hand. Then, shuffle your ' +
    'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && effect.target.cards.includes(this) &&
        !effect.powers.find(p => p.name === this.powers[0].name)) {
      effect.powers.push(this.powers[0]);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.usedVSTAR) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.usedVSTAR = true;
      
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

      return state;
    }
    
    return state;
  }
}