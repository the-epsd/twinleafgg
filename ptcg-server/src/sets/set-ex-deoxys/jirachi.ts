import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, BoardEffect } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, CardList, ChooseCardsPrompt, ShowCardsPrompt, ShuffleDeckPrompt, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { IS_POKEBODY_LOCKED } from '../../game/store/prefabs/prefabs';

export class Jirachi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Wishing Star',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Jirachi is your Active Pokémon, you may look at the top 5 cards of your deck, choose 1 of them, and put it into your hand. Shuffle your deck afterward. Jirachi and your other Active Pokémon, if any, are now Asleep. This power can\’t be used if Jirachi is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Metallic Blow',
    cost: [CardType.METAL, CardType.COLORLESS],
    damage: 20,
    text: 'If the Defending Pokémon has any Poké-Bodies, this attack does 20 damage plus 30 more damage.'
  }];

  public set: string = 'DX';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jirachi';
  public fullName: string = 'Jirachi DX';

  public readonly WISHING_STAR_MARKER = 'WISHING_STAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = opponent.active.getPokemonCard();

      if (target !== undefined && target.powers.some(power => power.powerType === PowerType.POKEBODY)) {
        if (!IS_POKEBODY_LOCKED(store, state, player, target)) {
          effect.damage += 30;
        }
      }
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.WISHING_STAR_MARKER, this);
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.WISHING_STAR_MARKER, this)) {
      effect.player.marker.removeMarker(this.WISHING_STAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.WISHING_STAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] !== this) {
        return state; // Not active
      }

      if (player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 5);
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        player.marker.addMarker(this.WISHING_STAR_MARKER, this);
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.deck);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            cardList.addSpecialCondition(SpecialCondition.ASLEEP);
          }
        });

        if (selected.length > 0) {
          return store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            selected
          ), () => {
          });
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}