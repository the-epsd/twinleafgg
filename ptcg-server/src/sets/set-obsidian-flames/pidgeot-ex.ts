import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ConfirmPrompt, PowerType, ChooseCardsPrompt, ShuffleDeckPrompt, GameError, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../game/store/prefabs/prefabs';


export class Pidgeotex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Pidgeotto';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 280;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public powers = [{
    name: 'Quick Search',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may search your deck for a ' +
      'card and put it into your hand. Then, shuffle your deck. ' +
      'You can\'t use more than 1 Quick Search Ability each turn. '

  }];

  public attacks = [
    {
      name: 'Blustery Wind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'You may discard a Stadium in play.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public name: string = 'Pidgeot ex';

  public fullName: string = 'Pidgeot ex OBF';

  public readonly QUICK_SEARCH_MARKER = 'QUICK_SEARCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SEARCH_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SEARCH_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.QUICK_SEARCH_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.QUICK_SEARCH_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);

        });
      });
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), (wantToUse) => {
          if (wantToUse) {
            DISCARD_A_STADIUM_CARD_IN_PLAY(state);
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}