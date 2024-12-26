
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, ShuffleDeckPrompt, State, StoreLike, TrainerCard } from '../../game';

import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

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
      name: 'Star Alchemy',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      text: 'The Pokémon V this card is attached to can use the VSTAR Power on this card.' +
        '' +
        'During your turn, you may search your deck for a card and put it into your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR Power in a game.) '
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && effect.target.cards.includes(this) &&
      !effect.powers.find(p => p.name === this.powers[0].name)) {
      const player = effect.player;
      const hasValidCard = effect.target.cards.some(card =>
        card.tags.some(tag =>
          tag === CardTag.POKEMON_V ||
          tag === CardTag.POKEMON_VSTAR ||
          tag === CardTag.POKEMON_VMAX
        )
      );

      if (!hasValidCard) {
        return state;
      }

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.powers.push(this.powers[0]);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });

      return state;
    }

    return state;
  }
}