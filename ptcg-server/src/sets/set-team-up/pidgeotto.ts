import { GameError, PlayerType, PokemonCard, PowerType } from '../../game';
import { GameMessage } from '../../game/game-message';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Pidgeotto extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardType: CardType = C;

  public hp: number = 60;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public powers = [{
    name: 'Air Mail',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may look at the top 2 cards of your deck and put 1 of them into your hand. Put the other card on the bottom of your deck.'
  }];

  public attacks = [
    {
      name: 'Gust',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Pidgeotto';

  public fullName: string = 'Pidgeotto TEU';

  public readonly AIR_MAIL_MARKER = 'AIR_MAIL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.AIR_MAIL_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.AIR_MAIL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const deckBottom = new CardList();
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 2);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        player.marker.addMarker(this.AIR_MAIL_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(deckBottom);
        deckBottom.moveTo(player.deck);
        return state;
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.AIR_MAIL_MARKER, this);
    }

    return state;
  }
}
