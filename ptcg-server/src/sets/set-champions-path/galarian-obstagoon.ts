import {
  ChooseCardsPrompt,
  GameError, PlayerType,
  PowerType,
  ShowCardsPrompt,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class GalarianObstagoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Galarian Linoone';
  public cardType: CardType = D;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Wicked Ruler',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may have your opponent discard cards from their hand until they have 4 cards in their hand.'
  }];

  public attacks = [{
    name: 'Knuckle Impact',
    cost: [C, C, C],
    damage: 180,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'D';
  public set: string = 'CPA';
  public name: string = 'Galarian Obstagoon';
  public fullName: string = 'Galarian Obstagoon CPA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';

  public readonly WICKED_RULER_MARKER = 'WICKED_RULER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Knuckle Impact
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.WICKED_RULER_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const handSize = opponent.hand.cards.length;
      const cardsToRemove = handSize - 4;

      if (handSize <= 4) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.WICKED_RULER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: cardsToRemove, max: cardsToRemove, allowCancel: false }
      ), selected => {
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: selected, sourceCard: this, sourceEffect: this.powers[0] });

        selected.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name, effectName: this.powers[0].name });
        });

        store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          selected
        ), () => { });

        player.marker.addMarker(this.WICKED_RULER_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        return state;
      });

    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.WICKED_RULER_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.WICKED_RULER_MARKER, this);
    }

    return state;
  }
}
