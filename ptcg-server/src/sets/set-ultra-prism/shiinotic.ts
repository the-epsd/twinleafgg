import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, StateUtils, Card, ChooseCardsPrompt, ShuffleDeckPrompt, ShowCardsPrompt, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Shiinotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];
  public evolvesFrom: string = 'Morelull';

  public powers = [{
    name: 'Tasting',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may search your deck for a [Y] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Flickering Spores',
    cost: [Y, C],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'UPR';
  public name: string = 'Shiinotic';
  public fullName: string = 'Shiinotic UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';

  public readonly ILLUMINATE_MARKER = 'ILLUMINATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.ILLUMINATE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check to see if anything is blocking our Ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (player.marker.hasMarker(this.ILLUMINATE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, cardType: Y },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];

        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }

        player.marker.addMarker(this.ILLUMINATE_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.hand);
        });

        if (cards.length > 0) {
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          ), () => {
          });
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}